import React, { useEffect, useState } from 'react'

function useOrigin() {

    const [mounted , setMounted] = useState(false)

    useEffect(()=> {
        setMounted(true)
    } , [])

    
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
    if(!mounted){
        return null
    }

    return origin
}

export default useOrigin
