// import { response } from "express";
const fs = require('fs');



const users = []
const loadCSV = (path) =>{
    const csv = fs.readFileSync(path , "utf8").trim();
    const lines  = csv.split('\n');
    const headers = ['name' , 'email', 'password'];
    const rows = lines.map(line =>{
        const values = line.split(',');

        let obj={};
        headers.forEach((h,i)=>{
            obj[h] = values[i];
        });

        return obj;
    })

    return rows;
}

const jsonUsers = loadCSV('/home/yash/crap/minorProjs/scripts/faculty.csv');
// console.log(jsonUsers)

const createUser = async(user)=>{
    try{
        console.log(user);
        const response = await fetch("http://localhost:8000/api/v1/users/register",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                fullname: user.name,
                email:user.email,
                password : user.password,
                isaFaculty:true
            })
        });

        const data = await response.text();
        console.log(data)
        // console.log("success");
    }catch(err){
        console.log(err)
    }
}


(async()=>{
    for(let user of jsonUsers){
        await createUser(user);
    }
    
})();

// for (let user of users){

//     try{
//         const response = await fetch("http://localhost:8000/api/v1/users/register",{
//             method:'POST',
//             headers:{
//                 'Content-Type':'application/json'
//             },
//             body: JSON.stringify({
//                 fullname: user.name,
//                 email:user.email,
//                 password : user.password
//             })
//         });

//         const data = await response.json();
//         console.log("success");
//     }catch(err){
//         console.log(error)
//     }

    
// }