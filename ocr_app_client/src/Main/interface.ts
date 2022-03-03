export interface ImgInfoType {
    key: string;
    data: string;
    txt: string;
    done: boolean;
    percentage: number;
}

export interface ImgTxtDataType {
    key: string;
    data: string;
}


/*
* jobId: "Job-0-308ea"
progress: 0
status: "recognizing text"
userJobId: "Job-4-4a662"
workerId: "Worker-0-fd056"
[[Prototype]]: Object
* */
export interface TessProcessResponse {
    progress: number;
    key: string;
}

export type ImgInfoArr = Array<ImgInfoType>;
