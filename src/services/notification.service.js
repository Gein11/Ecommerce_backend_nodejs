const { NotifyTypeConstant } = require("../constants/notify-type.consant");
const notificationModel = require("../models/notification.model");

const pushNotificationToSystem = async ({
  type = NotifyTypeConstant.SHOP_001,
  receivedId = 1,
  senderId = "",
  options = {},
}) => {
  //   let notiContent = await NotificationService.getContent(type, options);
  let notiContent;
  if (type === NotifyTypeConstant.SHOP_001) {
    notiContent = `Shop ${options?.shop_name} added to new item ${options?.product_name}`;
  } else {
    notiContent = `Shop ${options?.shop_name} added to new voucher ${options?.product_name}`;
  }
  return await notificationModel.create({
    noti_type: type,
    noti_content: notiContent,
    noti_sender_id: senderId,
    noti_received_id: receivedId,
    noti_options: options,
  });
};
const listNotificationByUser = async ({
  userId = 1,
  type = "ALL",
  isRead = 0,
}) => {
  const match = { noti_received_id: userId };

  if (type !== "ALL") {
    match["noti_type"] = type;
  }
  console.log("match", match);
  const result = await notificationModel.aggregate([
    {
      $match: match,
    },
    {
      //  $project is the second stage in the aggregation pipeline.
      // It specifies the fields to include in the returned documents
      $project: {
        noti_type: 1,
        noti_sender_id: 1,
        noti_received_id: 1,
        noti_content: 1,
        createAt: 1,
        noti_options: 1,
      },
    },
  ]);
  console.log("result", result);
  return result;
};
module.exports = { pushNotificationToSystem, listNotificationByUser };
