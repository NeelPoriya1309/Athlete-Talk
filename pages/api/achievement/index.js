const nc = require('next-connect');
const authController = require('../../../controllers/authController');
const catchAsync = require('./../../../utils/catchAsync');
const PDFDocument = require('pdfkit');

const buildPDF = (dataCallback, endCallback, chat) => {
  const doc = new PDFDocument({
    size: 'C4',
    layout: 'landscape',
  });
  doc.on('data', dataCallback);
  doc.on('end', endCallback);
  doc.fontSize(25).text('Congratulations!', 100, 50);
  doc
    .fontSize(20)
    .text('You have completed Take 5 days of your week for this!...', 100, 100);
  doc.image('public/achievement.png', 150, 20, { width: 550 });

  doc.end();
};

const handler = nc({
  onError: authController.onError,
  onNoMatch: authController.onNoMatch,
});

handler.get(
  //   authController.protect,
  catchAsync(async (req, res, next) => {
    const { chat } = req.body;

    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment;filename=mypdf.pdf`,
    });

    buildPDF(
      (data) => stream.write(data),
      () => stream.end(),
      chat
    );
  })
);

export default handler;
