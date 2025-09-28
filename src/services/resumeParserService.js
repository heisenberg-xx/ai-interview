export const parseResumeFile = async (file) => {
  return new Promise((resolve, reject) => {
    const acceptedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!acceptedTypes.includes(file.type)) {
      return reject(new Error('Invalid file type. Please upload a PDF or DOCX.'));
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(new Error('Failed to read the resume file.'));
    };
    
 
    reader.readAsText(file);
  });
};
