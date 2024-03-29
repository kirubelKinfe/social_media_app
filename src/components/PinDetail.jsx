import { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { client, urlFor } from '../client'
import MasonryLayout from './MasonryLayout'
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'
import { HiUserCircle } from 'react-icons/hi'

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const { pinId } = useParams()

  const addComment = () => {
    if(comment) {
      setAddingComment(true)
      client
        .patch(pinId)
        .setIfMissing({ comments: []})
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails()
          setComment('')
          setAddingComment(false)
        })
    }
  }
  
  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if(query) {
      client.fetch(query)
        .then((data) => {
          setPinDetail(data[0])

          if(data[0]) {
            query = pinDetailMorePinQuery(data[0])

            client.fetch(query)
              .then((res) => setPins(res))
          }
        })
    }
  }
  

  useEffect(() => {
    fetchPinDetails()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinId])

  if(!pinDetail) return <Spinner message="Loading pin..." />


  return (
    <>
      <div className='flex flex-col m-auto bg-white xl-flex-row' style={{ maxWidth: '1500px', borderRadius: '32px' }}>
        <div className='flex items-center justify-center flex-initial md:items-start'>
          <img 
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            className="rounded-bl-lg rounded-t-3xl"
            alt='user-post'
          />
        </div>
        <div className='flex-1 w-full p-5 xl:min-w-620'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => {
                        e.stopPropagation();
                      }}
                className="flex items-center justify-center p-2 text-xl bg-white rounded-full outline-none opacity-75 w-9 h-9 text-dark hover:opacity-100 hover:shadow-md"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a href={pinDetail.destination} target="_blank" rel='noreferrer'>{pinDetail.destination}
            </a>
          </div>

          <div>
            <h1 className='mt-3 text-4xl font-bold break-words'>
              {pinDetail.title}
            </h1>
            <p className='mt-3'>{pinDetail.about}</p>
          </div>
          <Link to={`/user-profile/${pinDetail.postedBy?._id}`} className="flex items-center gap-2 mt-5 bg-white rounded-lg">
            {pinDetail.postedBy?.image 
              ? <img
                className="object-cover w-8 h-8 rounded-full"
                src={pinDetail.postedBy?.image}
                alt="user-profile"
              />
              : <HiUserCircle className="h-12 rounded-lg w-14" />
            }
            <p className="font-semibold capitalize">{pinDetail.postedBy?.userName}</p>
          </Link>

          <h1 className='mt-5 text-2xl'>Comments</h1>

          <div className='overflow-y-auto max-h-370'>
            {pinDetail?.comments?.map((comment, i) => (
              <div className="flex items-center gap-2 mt-5 bg-white rounded-lg">
                <img 
                  src={comment.postedBy.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div>
                  <p className='font-bold'>{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='flex flex-wrap mt-6 gap3'>
            <Link to={`/user-profile/${pinDetail.postedBy?._id}`}>
              
              {user?.image
                ? 
                <img
                  className="w-10 h-10 rounded-full cursor-pointer"
                  src={user?.image}
                  alt="user-profile"
                />
                : <HiUserCircle className="w-10 h-10 rounded-full cursor-pointer" />  
              }
            </Link>
            <input 
              className='flex-1 p-2 border-2 border-gray-100 outline-none rounded-2xl focus:border-gray-300'
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type='button'
              className='px-6 py-2 text-base font-semibold text-white bg-red-500 rounded-full outline-none'
              onClick={addComment}
            >
              {addingComment ? 'Posting the comment...' : "Post"}
            </button>
          </div>

        </div>
      </div>

      {pins?.length > 0 ? (
        <>
          <h2 className='mt-8 mb-4 text-2xl font-bold text-center'>
            More Like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Loading more pins..." />
      )}
    </>  
  )
}

export default PinDetail