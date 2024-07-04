import axios from 'axios'

export const customFetch = axios.create({
    baseURL: "http://localhost:8080/api/v1"
})

export const links = [
    {id:1, name:"Home", link:"/"},
    {id:2, name:"About", link:"/about"},
    {id:3, name:"MyTests", link:"/mytests"},
    {id:4, name:"Admin", link:"/admin"},
]

export const getQueryReadyUrl = (apiPath, request) => {
    // get the page in the url
    let {page, name, subject} = Object.fromEntries([
        ...new URL(request.url).searchParams.entries(),
    ]);

 
    return `/${apiPath}?page=${page || 1}&name=${name || ""}&subject=${subject || ""}`
  }

export const statusOptions = ['available', 'paused', 'completed']

export const provideStartExamBtn = (is_present, status) => {
    if (!is_present){
        return (
            <button
            name='intent'
            value='not_present'
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
                Start Test
            </button>
        )
    }

    if (status === "available"){
        return (
            <button
            name='intent'
            value='available'
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
                Go To Test
            </button>
        )
    }

    if (status === "paused"){
        return (
            <button
            name='intent'
            value='paused'
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
                Resume Test
            </button>
        )
    }

    if (status === "completed"){
        return (
            <button
            name='intent'
            value='completed'
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
                Check Result
            </button>
        )
    }
    
}