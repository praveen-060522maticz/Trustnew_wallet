import RNFS from 'react-native-fs';



  export const readFileContent = async (uri) => {
    try {
      const content = await RNFS.readFile(uri, 'utf8');
      return content;
    } catch (error) {
      console.error('Error reading the file:', error);
      return '';
    }
  };
  export const File_to_Phrase = async (type,uri)=>{
    try {
    
      if(type=="txt"){
        let Importfilefunc=await readFileContent(uri)
        return Importfilefunc
     }
     if(type=="csv"){
        let csvData = await RNFS.readFile(uri, 'utf8');

        let phrasestring=csvData.split(",").join(" ")
        return phrasestring


     }
          
          


  } catch (err) {
      console.warn("File_read_error",err);
  }

  }