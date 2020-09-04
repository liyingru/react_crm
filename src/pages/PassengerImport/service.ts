import Axios from 'axios';
import URL from '@/api/serverAPI.config';

 export async function getImportLog(){
    return Axios.post(URL.importLog)
 }