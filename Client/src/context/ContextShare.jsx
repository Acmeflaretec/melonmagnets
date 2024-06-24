import React, {  createContext, useState } from 'react'

export const cartResponseContext = createContext()
export const removeCartContext = createContext()

function ContextShare({children}) {
    const [ toggleCart , setToggleCart] = useState(false)
    const [ removeCart , setRemoveCart] = useState(false)
  return (
    <removeCartContext.Provider value={{removeCart , setRemoveCart}}>
      <cartResponseContext.Provider value={{toggleCart , setToggleCart}}>
          {children}
      </cartResponseContext.Provider>
    </removeCartContext.Provider>
  )
}

export default ContextShare