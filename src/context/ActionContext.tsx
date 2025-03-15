'use client'
import { createContext, useState } from "react"

const ActionContext = createContext(null)

function ActionProvider({children}: {children: React.ReactNode}) {
    const [action, setAction] = useState()
    return (
        <ActionContext.Provider value={{action, setAction}}>
{children}
        </ActionContext.Provider>
    )
}

export{
    ActionContext,
    ActionProvider
}