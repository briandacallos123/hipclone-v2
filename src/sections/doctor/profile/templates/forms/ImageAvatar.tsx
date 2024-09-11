import React from 'react'
import Image from '@/components/image'

const ImageAvatar = ({src, width, height, ...rest}:any) => {

  return (
   <Image
    src={src}
    width={width}
    height={height}
    {...rest}
   />
  )
}

export default ImageAvatar