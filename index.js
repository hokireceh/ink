import { privateKey } from "./accounts/accounts.js";
import Core from "./src/core/core.js";
import { Helper } from "./src/utils/helper.js";
import logger from "./src/utils/logger.js";
import twist from "./src/utils/twist.js";

async function operation(acc) {
  const core = new Core(acc);
  try {
    await core.connectWallet();
    await core.getBalance();
    await core.getLastGm();

    const delay = core.nextGM - Date.now();
    if (delay < 0) {
      await Helper.delay(2000, acc, `Time to say GM`, core);
      await core.GM();
    }
    await Helper.delay(
      delay,
      acc,
      `Account ${core.address} Processing Done, Delaying for ${Helper.msToTime(
        delay
      )}`,
      core
    );
    await operation(acc);
  } catch (error) {
    if (error.message) {
      await Helper.delay(
        10000,
        acc,
        `Error : ${error.message}, Retry again after 10 Second`,
        core
      );
    } else {
      await Helper.delay(
        10000,
        acc,
        `Error :${JSON.stringify(error)}, Retry again after 10 Second`,
        core
      );
    }

    await operation(acc);
  }
}

async function startBot() {
  return new Promise(async (resolve, reject) => {
    try {
      logger.info(`BOT STARTED`);
      if (privateKey.length == 0)
        throw Error("Please input your account first on accounts.js file");
      const promiseList = [];

      for (const acc of privateKey) {
        promiseList.push(operation(acc));
      }

      await Promise.all(promiseList);
      resolve();
    } catch (error) {
      logger.info(`BOT STOPPED`);
      logger.error(JSON.stringify(error));
      reject(error);
    }
  });
}

(async () => {
  try {
    logger.clear();
    logger.info("");
    logger.info("Application Started");
    Helper.showSkelLogo();
    console.log(Helper.botName);
    console.log("By : Hokireceh");
    console.log("Follow On : https://github.com/hokireceh");
    console.log("Join Channel : https://t.me/garapanairdrop_indonesia");
    console.log("Dont forget to run git pull to keep up to date");
    await startBot();
  } catch (error) {
    twist.clear();
    twist.clearInfo();
    console.log("Error During executing bot", error);
    await startBot();
  }
})();
