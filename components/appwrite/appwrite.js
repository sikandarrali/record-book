import {Account, Client, Databases, Teams} from "appwrite";

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const teams = new Teams(client);

export { ID } from "appwrite";

const getCurrentUser = async () => {
	try {
		return account.get();
	} catch (error) {
		// console.log(error);
	}
};

const getCurrentSession = async () => {
	try {
		return account.getSession("current");
	} catch (error) {
		// console.log(error);
	}
};

const refreshCurrentSession = async () => {
	try {
		return account.updateSession("current");
	} catch (error) {
		// console.log(error);
	}
};

const listUserGroups = async () =>{
	try {
		return teams.list()
	} catch (error) {
		// console.log(error);
	}
}

const listUserOwnedGroups = async(userEmail) =>{
	try {
		const allUserGroups = await listUserGroups()
		return allUserGroups.teams.filter((item) => item.prefs.creatorEmail === userEmail);
	}
	catch (e){
		console.log(e);
	}
}

const getGroup = async (groupID) =>{
	try {
		return teams.get(groupID)
	} catch (error) {
		// console.log(error);
	}
}



export {
	account,
	client,
	databases,
	teams,
	getGroup,
	getCurrentSession,
	refreshCurrentSession,
	getCurrentUser,
	listUserGroups,
	listUserOwnedGroups
};
