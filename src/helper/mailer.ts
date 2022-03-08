import mailer from '@sendgrid/mail';

import { environment } from '../config/environment';
import { EEmailActions } from '../constants';

const sendEmail = async (action: EEmailActions, to: string, data: any = '') => {
  const { sengGridApiKey, emailSender } = environment;

  mailer.setApiKey(sengGridApiKey);

  if (action === EEmailActions.WELCOME) {
    const message = {
      to,
      from: environment.emailSender,
      subject: 'Welcome to Diver Ads',
      html: '<h2>Congratulations on your new splash account!</h2><p style="font-size: 1rem;">Your request has been received, it will be processed</p>',
    };

    return mailer.send(message);
  }
  if (action === EEmailActions.WITHDRAW) {
    const message = {
      to,
      from: emailSender,
      subject: 'Congratulations',
      html: '<h2>Your request have been recieved!</h2><p style="font-size: 1rem;">You will recieve your money on your wallet in not greater than an 2 hours</p>',
    };

    return mailer.send(message);
  }

  if (action === EEmailActions.PASSWORD) {
    const message = {
      to,
      from: emailSender,
      subject: 'Congratulations',
      html: `<h2>Your have requested a temporary password!</h2>
            <p style="font-size: 1rem;">A temporary password may only be used once and you must change it after you login
            <br/>
            <br/> 
            Password:<span>${data}</span></p>`,
    };

    return mailer.send(message);
  }
};

export default sendEmail;
