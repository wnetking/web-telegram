export function getMessage(message) {
  if (!message) {
    return '';
  }

  const { content } = message;
  if (!content) return null;

  let caption = '';
  if (content.caption && content.caption.text) {
    caption = `, ${content.caption.text}`;
  }

  if (message.ttl > 0) {
    return getServiceMessageContent(message);
  }

  switch (content['@type']) {
    case 'messageAnimation': {
      return 'AttachGif' + caption;
    }
    case 'messageAudio': {
      return 'AttachMusic' + caption;
    }
    case 'messageBasicGroupChatCreate': {
    }
    case 'messageCall': {
      return 'Call' + caption;
    }
    case 'messageChatAddMembers': {
    }
    case 'messageChatChangePhoto': {
    }
    case 'messageChatChangeTitle': {
    }
    case 'messageChatDeleteMember': {
    }
    case 'messageChatDeletePhoto': {
    }
    case 'messageChatJoinByLink': {
    }
    case 'messageChatSetTtl': {
    }
    case 'messageChatUpgradeFrom': {
    }
    case 'messageChatUpgradeTo': {
    }
    case 'messageContact': {
      return 'AttachContact' + caption;
    }
    case 'messageContactRegistered': {
    }
    case 'messageCustomServiceAction': {
    }
    case 'messageDocument': {
      const { document } = content;
      if (document && document.file_name) {
        return document.file_name + caption;
      }

      return 'AttachDocument' + caption;
    }
    case 'messageExpiredPhoto': {
      return 'AttachPhoto' + caption;
    }
    case 'messageExpiredVideo': {
      return 'AttachVideo' + caption;
    }
    case 'messageGame': {
      return 'AttachGame' + caption;
    }
    case 'messageGameScore': {
    }
    case 'messageInvoice': {
    }
    case 'messageLocation': {
      return 'AttachLocation' + caption;
    }
    case 'messagePassportDataReceived': {
    }
    case 'messagePassportDataSent': {
    }
    case 'messagePaymentSuccessful': {
    }
    case 'messagePaymentSuccessfulBot': {
    }
    case 'messagePhoto': {
      return 'AttachPhoto' + caption;
    }
    case 'messagePoll': {
      const { poll } = content;

      return '📊 ' + (poll.question || 'Poll') + caption;
    }
    case 'messagePinMessage': {
    }
    case 'messageScreenshotTaken': {
    }
    case 'messageSticker': {
      const { sticker } = content;
      let emoji = '';
      if (sticker && sticker.emoji) {
        emoji = sticker.emoji;
      }

      return 'AttachSticker' + (emoji ? ` ${emoji}` : '') + caption;
    }
    case 'messageSupergroupChatCreate': {
    }
    case 'messageText': {
      return content.text.text + caption;
    }
    case 'messageUnsupported': {
    }
    case 'messageVenue': {
      return 'AttachLocation' + caption;
    }
    case 'messageVideo': {
      return 'AttachVideo' + caption;
    }
    case 'messageVideoNote': {
      return 'AttachRound' + caption;
    }
    case 'messageVoiceNote': {
      return 'AttachAudio' + caption;
    }
    case 'messageWebsiteConnected': {
    }
    default: {
      return 'UnsupportedAttachment';
    }
  }
}
