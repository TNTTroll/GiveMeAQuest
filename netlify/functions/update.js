// --- Imports
const sendMessage = require("../../sendMessage");


// --- Variables
const users = [];

const commands = {
    "/addquest @user задание <баллы>": "Добавить свой квест. После команды нужно ввести имя пользователя, которому предназначается задание. Потом описать задание, а в конце в '<> скобках указать стоимость.",
    "/action @user ОБНЯТЬ|ПОЦЕЛОВАТЬ|УКУСИТЬ|ПОКОРМИТЬ": "Совершить действие надо другим участником Гильдии.",
    "/buy @user <номер письма>": "Введите команду, чтобы купить письмо другого участника. Внутри может быть какая-угодно информация. Только следите за ценами.",
    "/delete КВЕСТ|ПИСЬМО": "Можно удалить свой квест или закрытое письмо. Открытые письма удалять уже нельзя, будьте осторожны с тем, что вывешиваете на своей доске.",
    "/help": "Узнать список всех возможных команд.",
    "/hi": "Вступить в Гильдию.",
    "/info [@user]": "Узнать всю информацию про участника Гильдии.",
    "/letter @user <номер письма>": "Позволяет прочитать письмо другого участника",
    "/points": "Узнать баллы всех членов Гильдии.",
    "/solved @user ДА|НЕТ <номер задания>": "Вы завершаете квест участника Гильдии. ДА - баллы выдаются участнику. НЕТ - задание считается невыполненым и баллы не выдаются.",
    "/users": "Посмотреть список всех участников Гильдии",
};


// --- Defs
function getUser(message) {
    for (let i = 0; i < users.length; i++)
        if (users[i].id == message.from.id)
            return users[i];

    return null;
}

function getUserByTag(tag) {
    for (let i = 0; i < users.length; i++)
        if (users[i].tag == tag)
            return users[i];

    return null;
}

function setDev(me) {
    let newUser = new User(me.id, me.first_name, me.username);
    users.push(newUser);

    users[0].newQuest( new Quest("Поздравить с Днем Рождения", 10) );
    users[0].newQuest( new Quest("Обнять", 5) );
    users[0].newQuest( new Quest("Поцеловать", 8) );

    users[0].newWish( new Wish("???", 20, "Привет друг!") );
    users[0].newWish( new Wish("?", 10, "Привет подруга!") );
    users[0].newWish( new Wish("??", 15, "Привет муж!") );

    users[0].newBought( new Wish("!!", 15, "У меня 10 пальцев") );
    users[0].newBought( new Wish("!", 5, "Я правша") );

    users[0].points = 100;
    let info = `Путник, в нашей Гильдии есть такая информация про тебя\nId: ${users[0].id}\nИмя: ${users[0].name}\nТег: ${users[0].tag}\nБаллы: ${users[0].points}\nКвесты:${users[0].getAllQuests()}\nДоска закрытых писем:${users[0].getAllWishes()}\nДоска купленных писем:${users[0].getAllBought()}`;

    console.log(info);
}


// --- Main
exports.handler = async (event) => {
    console.log("Привет! Я работаю, все хорошо ^_^");
    console.log(event);
    console.log(event.body);

    const { message } = JSON.parse(event.body);

    console.log(event.body.edited_message);

    console.log("------------");
    console.log(message);
    console.log(message.message_id);

    const commandMatch = message.text.match(/(?<=\/).*?(?=$| |@)/);
    const command = commandMatch ? commandMatch[0] : null;

    const aimMatch = message.text.match(/(?<=@).*?(?=($| ))/);
    const aimText = aimMatch ? aimMatch[0] : null;

    const extraMatch = message.text.match(/(?<=\s).*?(?=$)/);
    var extra = extraMatch ? extraMatch[0] : null;
    if (extra != null)
        if (extra[0] === "@") 
            extra = extra.substring(extra.search(" ")+1);

    const me = message.from;
    //setDev(me);

    const user = getUser(message);
    const aim = (aimText != null) ? getUserByTag(aimText) : null;

    switch (command) {
    case "hi":
        let exist = false;
        for (let i = 0; i < users.length; i++)
            if (users[i].id == me.id) {
                exist = true;

                await sendMessage(message.chat.id, 
                    `С возвращением, ${users[i].name}!`);
            }

        if (!exist) {
            let newUser = new User(me.id, me.first_name, me.username);
            users.push(newUser);

            await sendMessage(message.chat.id,
                `Добро пожаловать в Гильдию, ${newUser.name}`);
        }
        break;


    case "info":
        if (aimText != null) {  // Смотрит кого-то другого
            if (aim != null) {
                let info = `Путник, про того, о ком ты спрашиваешь есть такая информация в Гильдии\nId: ${aim.id}\nИмя: ${aim.name}\nТег: ${aim.tag}\nБаллы: ${aim.points}\nКвесты:${aim.getAllQuests()}\nДоска закрытых писем:${aim.getAllWishes()}\nДоска купленных писем:${aim.getAllBought()}`;

                await sendMessage(message.chat.id, info);
            } else {
                let info = "Прости, Путник, я не узнаю этого человека... Попробуй использовать команду /hi, чтобы вступить в нашу гильдию!";

                await sendMessage(message.chat.id, info);
            }
        
        } else {  // Смотрит себя
            if (user == null)
                await sendMessage(message.chat.id, 
                "Прости, Путник, я не узнаю тебя... Попробуй использовать команду /hi, чтобы вступить в нашу гильдию!");
            else {
                let info = `Путник, в нашей Гильдии есть такая информация про тебя\nId: ${user.id}\nИмя: ${user.name}\nТег: ${user.tag}\nБаллы: ${user.points}\nКвесты:${user.getAllQuests()}\nДоска закрытых писем:${user.getAllWishes()}\nДоска купленных писем:${user.getAllBought()}`;

                await sendMessage(message.chat.id, info);
            }
        }

        break;


    case "points":
        let points = "";
        for (let i = 0; i < users.length; i++)
            points += `${users[i].name}: ${users[i].points}\n`;

        await sendMessage(message.chat.id,
            `БАЛЛЫ ВСЕХ ЛЮДЕЙ В ГИЛЬДИИ\n\n${points}`);
        break;


    case "help":
        let string = "Мои возможности в этой зоне обширны:\n\n";

        for (const key in commands)
            if (commands.hasOwnProperty(key))
                string += `${key}: ${commands[key]}\n`;

        await sendMessage(message.chat.id, string);
        break;


    case "addquest":
        if (aim != null && extra != null) {
            let start = extra.search("<");
            let end = extra.search(">");
            
            if (start != -1 && end != -1) {
                let questText = extra.substring(0, extra.search("<")-1);
                let points = extra.substring(start+1, end);

                aim.newQuest( new Quest(questText, points) );
                await sendMessage(message.chat.id, 
                    `${aim.name}, Вам дали новое задание на ${points} баллов. Необходимо\n'${questText}'`);

                break;
            }
        }

        await sendMessage(message.chat.id, "Команда введена неверно. /addQuest @user Текст задания <баллы>");
        break;
    

    case "solved":
        if (aim != null && extra != null) {
            let start = extra.search("<");
            let end = extra.search(">");

            if (start != -1 && end != -1) {
                let solvedText = extra.substring(0, extra.search("<")-1);
                let questNum = extra.substring(start+1, end)-1;

                if (solvedText.toLowerCase() == "да") {
                    let solvedQuest = aim.giveQuest(questNum);
                    if (solvedQuest != null) {
                        aim.points += Number(aim.giveQuest(questNum).points);
                        await sendMessage(message.chat.id, 
                            `${aim.name} выполнил квест от ${user.name} и получил ${aim.giveQuest(questNum).points}! Поздравляем!`);
                        aim.deleteQuest(questNum);
                    } else {
                        await sendMessage(message.chat.id,
                            `Номер квеста введен неверно. Попробуйте снова`);
                    }
                    
                } else if (solvedText.toLowerCase() == "нет") { 
                    let solvedQuest = aim.giveQuest(questNum);
                    if (solvedQuest != null) {
                        await sendMessage(message.chat.id, 
                            `Сожалеем! ${aim.name} не выполнил квест от ${user.name}!`);
                        aim.deleteQuest(questNum);
                    } else {
                        await sendMessage(message.chat.id,
                            `Номер квеста введен неверно. Попробуйте снова`);
                    }
                }

                break;
            }
        }

        await sendMessage(message.chat.id, "Команда введена неверно. /solved @user ДА|НЕТ <номер квеста>");
        break;


    case "wish":
        if (extra != null) {
            let startCost = extra.search("<");
            let endCost = extra.search(">");
            let startName = extra.search("{");
            let endName = extra.search("}");

            if (startCost != -1 && endCost != -1 && startName != -1 && endName != -1) {
                let wishCost = extra.substring(startCost+1, endCost);
                let wishName = extra.substring(startName+1, endName);
                let wishAnswer = extra.substring(endName+2);

                user.newWish( new Wish(wishName, wishCost, wishAnswer) );

                await sendMessage(message.chat.id, 
                    `Ваше письмо '${wishName}' было вывешено на торги за ${wishCost}. Его смогут купить другие участники Гильдии, если у них хватит на это баллов.`);

                break;
            }
        }

        await sendMessage(message.chat.id, "Команда введена неверно. /wish <стоимость> {название} ответ");
        break;


    case "buy":
        if (aim != null && extra != null) {
            let startBuy = extra.search("<");
            let endBuy = extra.search(">");

            if (startBuy != -1 && endBuy != -1) {
                let buyLetter = Number(extra.substring(startBuy+1, endBuy))-1;
                let letter = aim.giveWish(buyLetter);
                
                if (letter != null) {
                    if (user.points >= letter.cost) {
                        user.points -= letter.cost;
                        aim.newBought(letter);
                        aim.deleteWish(buyLetter);

                        await sendMessage(message.chat.id,
                            `Письмо '${letter.name}' было куплено и открыто. У Вас осталось ${user.points} баллов. Оно останется висеть на доске, если захотите снова его прочесть.`);
                    } else {
                        await sendMessage(message.chat.id, 
                            `Простите, но в Вашем кошельке не хватает золотых. У Вас ${user.points}, а нужно ${letter.cost}. Подзаработайте сначала, а потом ищите чужые секреты!`);
                    }

                } else {
                    await sendMessage(message.chat.id,
                            `Номер письма введен неверно. Попробуйте снова`);
                }

                break;
            }
        }

        await sendMessage(message.chat.id, "Команда введена неверно. /buy @user <номер письма>");
        break;


    case "letter":
        if (aim != null && extra != null) {
            let startLetter = extra.search("<");
            let endLetter = extra.search(">");

            if (startLetter != -1 && endLetter != -1) {
                let letterNum = extra.substring(startLetter+1, endLetter)-1;
                let myLetter = aim.giveBought(letterNum);

                if (myLetter != null) {
                    await sendMessage(message.chat.id,
                        `${myLetter.name}\n"${myLetter.text}"`);
                } else {
                    await sendMessage(message.chat.id,
                        `Номер письма введен неверно. Попробуйте снова`);
                }

                break;
            }
        }

        await sendMessage(message.chat.id, "Команда введена неверно. /letter @user <номер письма>");
        break;


    case "delete":
        if (extra != null) {
            let startDelete = extra.search("<");
            let endDelete = extra.search(">");

            if (startDelete != -1 && endDelete != -1) {
                let deleteNum = Number(extra.substring(startDelete+1, endDelete))-1;
                let deleteItem = extra.substring(0, startDelete-1).toLowerCase();

                if (deleteItem == "квест") {
                    let myLetter = user.giveQuest(deleteNum);
                    if (myLetter != null) {
                        await sendMessage(message.chat.id,
                            `Квест '${user.quests[deleteNum].text}' удален.`);
                        user.deleteQuest(deleteNum);
                    } else {
                        await sendMessage(message.chat.id,
                        `Номер квеста введен неверно. Попробуйте снова`);
                    }

                } else if (deleteItem == "письмо") {
                    let myLetter = user.giveWish(deleteNum);
                    if (myLetter != null) {
                        await sendMessage(message.chat.id,
                            `Письмо '${user.wishes[deleteNum].name}' удалено.`);
                        user.deleteWish(deleteNum);
                    } else {
                        await sendMessage(message.chat.id,
                        `Номер письма введен неверно. Попробуйте снова`);
                    }

                } else {
                    await sendMessage(message.chat.id, 
                        "Команда введена неверно. /delete КВЕСТ|ПИСЬМО <номер>");
                }
            }
            
            break;
        }
        
        await sendMessage(message.chat.id, "Команда введена неверно. /delete КВЕСТ|ПИСЬМО <номер>");
        break;


    case "god":
        if (aim != null && extra != null && user.id == 773961344) {
            let startGod = extra.search("<");
            let endGod = extra.search(">");

            if (startGod != -1 && endGod != -1) {
                let godNum = extra.substring(startGod+1, endGod);
                let godExtra = extra.substring(0, startGod-1).toLowerCase();

                if (godExtra == "балл") {
                    aim.points += Number(godNum);

                    await sendMessage(message.chat.id, 
                        `Участнику ${aim.name} выдано ${godNum}. Хвала небесам!`);

                } else if (godExtra == "письмо") {
                    let godLetter = aim.giveBought(godNum);

                    if (godLetter != null) {
                       aim.deleteBought(godNum);

                        await sendMessage(message.chat.id, 
                            `Открытое письмо участника ${aim.name} было удалено. Хвала небесам!`); 
                    } else {
                        await sendMessage(message.chat.id, 
                            `Номер письма введен неверно. Попробуйте снова`); 
                    }
                    
                }
            }
            
            break;
        }

        await sendMessage(message.chat.id, "Команда введена неверно. /god @user БАЛЛ|ПИСЬМО <число>");
        break;


    case "users":

        let usersString = "Список участников Гильдии:\n";
        for (let i = 0; i < users.length; i++)
            usersString += `[${i+1}]: ${users[i].name} - ${users[i].points}\n`;

        await sendMessage(message.chat.id, usersString);
        break;


    case "action":
        if (aim != null && extra != null) {
            let actionText = "";

            switch(extra.toLowerCase()) {
            case "обнять":
                actionText = "крепко обнял";
                break;
            case "поцеловать":
                actionText = "страстно поцеловал в губы";
                break;
            case "укусить":
                actionText = "сделал кусь";
                break;
            case "покормить":
                actionText = "принес тарелку фруктов для";
                break;
            case "связать":
                actionText = "проник в комнату и привязал к кровати";
                break;
            case "предложение":
                actionText = "встал на колено и сделал предложение руки и сердца";
                break;
            case "свадьба":
                actionText = "обвенчался с";
                break;
            case "отсосать":
                actionText = "встал на колени и отсосал";
                break;
            case "трахнуть":
                actionText = "жестко отымел";
                break;
            case "секс":
                actionText = "занялся сексом";
                break;
            case "минет":
                actionText = "сделал минет с окончанием";
                break;
            default:
                actionText = "подмигнул";
                break;
            }

            await sendMessage(message.chat.id, `${user.name} ${actionText} ${aim.name}`);
            break;
        }

        await sendMessage(message.chat.id, "Команда введена неверно. /action @user ОБНЯТЬ|ПОЦЕЛОВАТЬ|УКУСИТЬ");
        break;
    }


    return { statusCode: 200 };
};


// --- Classes
class User {
    constructor(id, name, tag) {
        this.id = id;
        this.name = name;
        this.tag = tag;
        this.points = 0;
        
        this.quests = [];
        this.wishes = [];
        this.bought = [];
    }

    newQuest(quest) {
        this.quests.push(quest);

        for (let i = 0; i < this.quests.length-1; i++) 
            for (let j = i; j < this.quests.length; j++) 
                if (this.quests[i].cost > this.quests[j].cost) {
                    let save = this.quests[i];
                    this.quests[i] = this.quests[j];
                    this.quests[j] = save;
                }
    }

    giveQuest(place) {
        return (place < this.quests.length) ? this.quests[place] : null;
    }

    getAllQuests() {
        let string = "\n";

        for (let i = 0; i < this.quests.length; i++)
            string += `[${i+1}] <${this.quests[i].points}p> ${this.quests[i].text}\n`;

        return (string != "\n") ? string : " ---";
    }

    deleteQuest(place) {
        this.quests.pop(place);
    }


    newWish(wish) {
        this.wishes.push(wish);

        for (let i = 0; i < this.wishes.length-1; i++) 
            for (let j = i; j < this.wishes.length; j++) 
                if (this.wishes[i].cost > this.wishes[j].cost) {
                    let save = this.wishes[i];
                    this.wishes[i] = this.wishes[j];
                    this.wishes[j] = save;
                }
    }

    giveWish(place) {
        return (place < this.wishes.length) ? this.wishes[place] : null;
    }

    getAllWishes() {
        let string = "\n";

        for (let i = 0; i < this.wishes.length; i++)
            string += `[${i+1}] <${this.wishes[i].cost}p> '${this.wishes[i].name}'\n`;

        return (string != "\n") ? string : " ---";
    }

    deleteWish(place) {
        this.wishes.pop(place);
    }


    newBought(bought) {
        this.bought.push(bought);

        for (let i = 0; i < this.bought.length-1; i++) 
            for (let j = i; j < this.bought.length; j++) 
                if (this.bought[i].cost < this.bought[j].cost) {
                    let save = this.bought[i];
                    this.bought[i] = this.bought[j];
                    this.bought[j] = save;
                }
    }

    giveBought(place) {
        return (place < this.bought.length) ? this.bought[place] : null;
    }

    getAllBought() {
        let string = "\n";

        for (let i = 0; i < this.bought.length; i++)
            string += `[${i+1}] <${this.bought[i].cost}p> '${this.bought[i].name}'\n`;

        return (string != "\n") ? string : " ---";
    }

    deleteBought(place) {
        this.bought.pop(place);
    }
}

class Quest {
    constructor(text, points) {
        this.text = text;
        this.points = points;
    }
}

class Wish {
    constructor(name, cost, text) {
        this.name = name;
        this.cost = cost;
        this.text = text;

        this.buy = false;
    }
}


// --- Links
/*
https://app.netlify.com/sites/givemeaquest/overview
https://travishorn.com/building-a-telegram-bot-with-netlify

curl -F "url=https://givemeaquest.netlify.app/.netlify/functions/update" https://api.telegram.org/bot7210471516:AAFdLPjIDLt3YyV2_RFxhm2E1zW612IvO6Q/setWebhook
*/