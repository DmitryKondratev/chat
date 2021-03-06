import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { getSocket } from '../../redux/index'

const Message = () => {

  const [messagesArr, setMessagesArr] = useState([])
  const [newMessagesArr, setNewMessagesArr] = useState([])
  const socket = getSocket()
  const user = useSelector((s) => s.auth.user)
  const activeChannel = useSelector((s) => s.channels.activeChannel)

  useEffect(() => {
    const handler = function (msg) {
      setMessagesArr([...messagesArr, msg])
    }
    socket.on('chat message', handler)
    return () => {
      socket.off('chat message', handler)
    }
  }, [messagesArr])

  useEffect(() => {
    if (newMessagesArr.length !== 0) {
      const lastItem = document.getElementsByClassName('flex items-start mt-4')[
        document.getElementsByClassName('flex items-start mt-4').length - 1
      ]
      lastItem.scrollIntoView(false)
    }
  }, [newMessagesArr, messagesArr])

  useEffect(() => {
    axios.get(`/api/v1/chat/messages/${activeChannel}`).then(({ data }) => {
      setNewMessagesArr(data)
    })
  }, [activeChannel])

  function getActualTime() {
    const monthsArr = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    const time = new Date()
    let hour = time.getHours()
    let minute = time.getMinutes()
    const day = time.getDate()
    const month = monthsArr[time.getMonth()]

    hour = hour < 10 ? `0${hour}` : hour
    minute = minute < 10 ? `0${minute}` : minute

    const data = `${hour}:${minute}, ${day} ${month}`
    return data
  }



  return (
    <div className="w-5/6 pt-0 ">
      {newMessagesArr.map((element) => (
        <div key={element.id} className="flex items-start mt-4">
          {' '}
          <img
            src={`https://ui-avatars.com/api/?size=40&name=${element.username}&length=1&font-size=0.5&background=44337a&color=fff`}
            className="w-10 h-10 rounded mr-3 mt-1"
            alt="profile-pic"
          />
          <div className="flex flex-col">
            <div className="flex items-end">
              <span className="font-bold mr-2 font-sans">{element.username}</span>

              <span className="text-black text-sm opacity-50 font-light">
                {element.sendingTime}
              </span>
            </div>
            <p id="" className="font-light text-gray-900">
              {element.message}
            </p>
          </div>
        </div>
      ))}

      {messagesArr.map((element) => (
        <div key={element.id} className="flex items-start mt-4">
          {' '}
          <img
            src={`https://ui-avatars.com/api/?size=40&name=${user.username}&length=1&font-size=0.5&background=44337a&color=fff`}
            className="w-10 h-10 rounded mr-3 mt-1"
            alt="profile-pic"
          />
          <div className="flex flex-col">
            <div className="flex items-end">
              <span className="font-bold mr-2 font-sans">{user.username}</span>
              <span className="text-black text-sm opacity-50 font-light">{getActualTime()}</span>
            </div>
            <p id="" className="font-light break-all text-gray-900">
              {element}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

Message.propTypes = {}

export default Message
