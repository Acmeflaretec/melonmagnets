import React, { useEffect, useState } from 'react';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';
import { Alert, Typography } from '@mui/material';
import PropTypes from "prop-types";

const DropZone = ({ dispatch }) => {
  let myDropzone;

  useEffect(() => {
    // Initialize Dropzone with options
    myDropzone = new Dropzone('#my-dropzone', {
      url: 'http://localhost:5000/api/v1/category', // Replace with the actual upload URL
      paramName: 'file', // The name to use for the file upload
      acceptedFiles: 'image/*,video/*',
      accept: function (file, done) {
        if (file.size === 0) {
          done('Folder uploads are not allowed. Please select individual files.');
        } else {
          dispatch(prev => [...prev, file])
          done();
        }
      },
    });

    myDropzone.on('addedfile', (file) => {
      console.log(`${file}`);
    });
    return () => {
      myDropzone.destroy();
    };
  }, []);

  return (
    <div style={{ marginLeft: 18 }}>
      <Alert severity="info"><Typography variant='caption'>
        Click here to select files or Drag files and drop here
      </Typography> </Alert>
      <form action="/file-upload"
        className="dropzone"
        id="my-dropzone"></form>
    </div>
  );
};

DropZone.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default DropZone;


// import React, { useEffect, useState } from 'react';
// import Dropzone from 'dropzone';
// import 'dropzone/dist/dropzone.css';
// import { Alert, Typography, Button, Box } from '@mui/material';
// import PropTypes from 'prop-types';

// const DropZone = ({ dispatch }) => {
//   let myDropzone;
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     // Initialize Dropzone with options
//     myDropzone = new Dropzone('#my-dropzone', {
//       url: 'http://localhost:5000/api/v1/category', // Replace with the actual upload URL
//       paramName: 'file', // The name to use for the file upload
//       acceptedFiles: 'image/*,video/*', // Accept all image and video formats
//       accept: function (file, done) {
//         if (file.size === 0) {
//           done('Folder uploads are not allowed. Please select individual files.');
//         } else {
//           setFiles(prev => [...prev, file]);
//           dispatch(prev => [...prev, file]);
//           done();
//         }
//       },
//     });

//     myDropzone.on('removedfile', (file) => {
//       setFiles(prev => prev.filter(f => f.name !== file.name));
//       dispatch(prev => prev.filter(f => f.name !== file.name));
//     });

//     return () => {
//       myDropzone.destroy();
//     };
//   }, [dispatch]);

//   const handleRemoveFile = (file) => {
//     myDropzone.removeFile(file);
//   };

//   return (
//     <div style={{ marginLeft: 18 }}>
//       <Alert severity="info">
//         <Typography variant='caption'>
//           Click here to select files or Drag files and drop here
//         </Typography>
//       </Alert>
//       <form action="/file-upload" className="dropzone" id="my-dropzone"></form>
//       <Box mt={2}>
//         {files.map((file, index) => (
//           <Box key={index} display="flex" alignItems="center" mb={1}>
//             <Typography variant="body2" mr={2}>{file.name}</Typography>
//             <Button variant="outlined" color="secondary" onClick={() => handleRemoveFile(file)}>
//               Remove
//             </Button>
//           </Box>
//         ))}
//       </Box>
//     </div>
//   );
// };

// DropZone.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

// export default DropZone;
