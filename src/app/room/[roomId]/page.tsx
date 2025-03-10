import ChatView from '@/components/ui/ChatView'
import React from 'react'

async function Room({params}: {params: {roomId: string}}) {
   const param = await params
   const roomId = param.roomId
  return (
    <div className='flex items-center justify-between'>
        <div>
        <ChatView roomId={roomId} />
        </div>
        <div>
        previee area 
        </div>
    </div>
  )
}

export default Room