import http from "http";
export const secondsToMilliSeconds = (seconds: number): number => {
    return  Math.round(1000 * seconds);;
};

export const post = (url: string, postData: string, options?: any): Promise<boolean> => {
    return new Promise((resolve) => {
        let flag = false;
        try {
            // console.log('url:',url,'postData:',postData);
            let req = http.request(url, options, (res) => {
                let chunks: Uint8Array[] = [];

                res.on("data", (chunk) => {
                    chunks.push(chunk);
                    flag = true;
                    resolve(flag);
                });

                res.on("end", () => {
                    // let body = Buffer.concat(chunks);
                    // console.log(body.toString());
                });

                res.on("error", function (error) {
                    console.log(error);
                    resolve(flag);
                });
            });

            req.write(postData);

            req.end();
        } catch (e) {
            resolve(flag);
        }

    })
}