import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import { client } from "../client"
import { feedQuery } from "../utils/data"
import MasonryLayout from "./MasonryLayout"
import Spinner from "./Spinner"

const Feed = () => {
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState(null)
  const categoryId = useParams();

  useEffect(() => {
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data)
          setLoading(false)
  }, [categoryId])})

  if(loading) return <Spinner message="We are adding new ideas to your feed" />

  if(!pins?.length) return <h2>No pins available</h2>

  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed