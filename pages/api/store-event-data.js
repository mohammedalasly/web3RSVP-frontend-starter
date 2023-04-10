import { Web3Storage, File, getFilesFromPath } from "web3.storage" //  import helpers
const { resolve } = require("path")

//* to handle the incoming requests
export default async function handler(req, res) {
    if (req.method === "POST") {
        return await storeEventData(req, res)
    } else {
        return res
            .status(405)

            .json({ message: "Method not allowed", success: false })
    }
}
//* get the event data from the request body and store the data, and return an error if unsuccessful
async function storeEventData(req, res) {
    const body = req.body
    try {
        // to create a json file that includes metadata passed from the req.body object.
        const files = await makeFileObjects(body)
        // store that json file to Web3.storage.
        const cid = await storeFiles(files) // cid points to an IPFS directory of the file we just stored.
        return res.status(200).json({ success: true, cid: cid })
    } catch (err) {
        return res.status(500).json({ error: "Error creating event", success: false })
    }
}
//* create a Buffer from the stringified body, will also look up the image from body.image
async function makeFileObjects(body) {
    const buffer = Buffer.from(JSON.stringify(body))

    const imageDirectory = resolve(process.cwd(), `public/images/${body.image}`)
    const files = await getFilesFromPath(imageDirectory) // to get the image from our images folder.

    files.push(new File([buffer], "data.json"))
    return files
}
//* create a Web3Storage client object to interact with.
function makeStorageClient() {
    return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN })
}
//* call put method on the client to upload our array of files.
async function storeFiles(files) {
    const client = makeStorageClient()
    const cid = await client.put(files)
    return cid
}
