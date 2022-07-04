import axios from "axios";
import { TImageUploadResult } from "@appTypes/timebookTypes";

const handleUpload = async (
    uploadTokens: TImageUploadResult[],
    formDataPhotos: any[]
) => {
    return await Promise.all(
        uploadTokens?.map((token: TImageUploadResult, index: number) => {
            const { url, mime } = token;
            const options = {
                headers: {
                    "Content-Type": mime,
                },
            };
            return axios.put(url, formDataPhotos[index], options);
        })
    );
};

export default handleUpload;
