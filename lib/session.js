const { account } = require("@/components/appwrite/appwrite");

export const session = await account.getSession("current");
