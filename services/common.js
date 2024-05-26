const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "lenovok8plus38@gmail.com",
    pass: process.env.MAIL_PASSWORD,
  },
});

async function sendMail({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: '"BuyNow 👻" <lenovok8plus38@gmail.com>',
    to,
    subject,
    text,
    html,
  });

  return info;
}

function invoiceTemplate(order) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Receipt</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: linear-gradient(to right, #ffecd2, #fcb69f);
              /* background-color: #f4f4f4; */
          }
          .invoice-container {
              max-width: 800px;
              margin: 20px auto;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              background: linear-gradient(to right, #ffecd2, #fcb69f);
              border-radius: 8px;
          }
          .invoice-header {
              text-align: center;
              margin-bottom: 20px;
          }
          .invoice-header img {
              max-width: 150px;
          }
          .invoice-header h1 {
              margin: 10px 0;
              color: #333333;
          }
          .invoice-content {
              margin-bottom: 20px;
          }
          .invoice-content h2 {
              margin-bottom: 10px;
              color: #333333;
          }
          .invoice-content p {
              margin-bottom: 10px;
              color: #666666;
          }
          .invoice-details, .product-details {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
          }
          .invoice-details th, .invoice-details td, .product-details th, .product-details td {
              padding: 10px;
              border: 1px solid #dddddd;
              text-align: left;
          }
          .invoice-details th, .product-details th {
              /* background-color: #f8f8f8; */
              /* background: linear-gradient(to right, #ffecd2, #fcb69f); */
              color: #333333;
          }
          .product-details img {
              max-width: 50px;
          }
          .invoice-footer {
              text-align: center;
              color: #666666;
              font-size: 12px;
          }
          @media (max-width: 600px) {
              .invoice-container {
                  padding: 10px;
              }
              .invoice-header img {
                  max-width: 100px;
              }
              .invoice-details, .product-details {
                  font-size: 14px;
              }
              .product-details img {
                  max-width: 30px;
              }
              .product-details th, .product-details td {
                  padding: 5px;
              }
          }
          @media (max-width: 360px) {
              .invoice-header img {
                  max-width: 80px;
              }
              .invoice-details, .product-details {
                  font-size: 12px;
              }
              .invoice-details th, .invoice-details td, .product-details th, .product-details td {
                  padding: 8px 5px;
              }
              .product-details img {
                  max-width: 25px;
              }
              .invoice-content h2, .invoice-content p {
                  font-size: 14px;
              }
          }
      </style>
  </head>
  <body>
      <div class="invoice-container">
          <div class="invoice-header">
              <img src="https://res.cloudinary.com/ds0ojjzzd/image/upload/v1715499093/logo-no-background_s0tbzm.png" alt="Company Logo">
              <h1>Thank You for Your Order!</h1>
          </div>
          <div class="invoice-content">
              <h2>Here is a summary of your recent order:</h2>
              <p>If you have any questions or concerns about your order, please contact us.</p>
              <table class="invoice-details">
                  <tr>
                      <th>Order ID</th>
                      <td>${order.id}</td>
                  </tr>
                  <tr>
                      <th>Order Total Items</th>
                      <td>${order.totalItems}</td>
                  </tr>
                  <tr>
                      <th>Order Total Amount</th>
                      <td>₹${
                        order.totalAmount
                      } ( Including Convenience Fee ) </td>
                  </tr>
              </table>
              <h2>Products:</h2>
              <table class="product-details">
                  <tr>
                      <th>Image</th>
                      <th>Product Title</th>
                      <th>Quantity</th>
                      <th>Price</th>
                  </tr>
                  ${order.items.map((item) =>{
                    return(
                    <tr>
                      <td>
                        <img
                          src={item.product.thumbnail}
                          alt="Product 1"
                        />
                      </td>
                      <td>{item.product.title}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.product.price * item.quantity}</td>
                    </tr>
                    )
                  })}
              </table>
              <h2>Shipping Address:</h2>
              <table class="invoice-details">
                  <tr>
                      <th>Address Name</th>
                      <td>${order.selectedAddress.name}</td>
                  </tr>
                  <tr>
                      <th>Street</th>
                      <td>${order.selectedAddress.street}</td>
                  </tr>
                  <tr>
                      <th>City</th>
                      <td>${order.selectedAddress.city}</td>
                  </tr>
                  <tr>
                      <th>State</th>
                      <td>${order.selectedAddress.state}</td>
                  </tr>
                  <tr>
                      <th>Pin Code</th>
                      <td>${order.selectedAddress.pincode}</td>
                  </tr>
                  <tr>
                      <th>Phone</th>
                      <td>${order.selectedAddress.phone}</td>
                  </tr>
              </table>
          </div>
          <div class="invoice-footer">
              <p>&copy; 2024 buynow-ecommerce.onrender.com All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>`;
}

module.exports = { sendMail, invoiceTemplate };
