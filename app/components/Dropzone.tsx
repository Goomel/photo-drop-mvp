'use client';
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

function Dropzone({handleUpload}: {handleUpload: (files: File[]) => void}) {
  const onDrop = useCallback((files: File[]) => {
    handleUpload(files)
  }, [])
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} className="border border-gray-400 p-10 rounded-2xl w-full max-w-lg mx-auto">
      <input {...getInputProps()} />
      {
          isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
        }
    </div>
  )
}

export default Dropzone;