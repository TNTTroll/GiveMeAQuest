// --- Imports
const sendMessage = require("../../sendMessage");


// --- Variables
const users = [];


// --- Main
exports.handler = async (event) => {
    const { msg } = JSON.parse(event['body']);

    console.log(event);

    console.log(msg);

    let user = msg.from;

    let exist = false;
    for (let i = 0; i < users.length; i++)
        if (users[i].id == user.id) {
            exist = true;

            await sendMessage(msg.chat.id, 
                `С возвращением, <b>${users[i].name}</b>!`);
        }

    if (!exist) {
        let newUser = new User(user.id, user.first_name);
        users.push(newUser);

        await sendMessage(msg.chat.id, 
            `Добро пожаловать в Гильдию, <b>${newUser.name}</b>!`);
    }

    return { statusCode: 200 };
};


// --- Classes
class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.points = 0;
    }
}