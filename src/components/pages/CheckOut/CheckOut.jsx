import React from 'react';
import { useLocation } from "react-router-dom";
import './CheckOut.css';
// import icons
import MagnifyingGlass from '../../../assets/Icon_line/FindNow.svg';

// Function to map bankId to a bank name
const bankList = {
  "970400": "SAIGONBANK - Ngân hàng Công thương Sài Gòn",
  "970403": "Sacombank - Ngân hàng TMCP Sài Gòn Thương Tín",
  "970405": "Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
  "970407": "Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam",
  "970414": "OceanBank - Ngân hàng thương mại TNHH một thành viên Đại Dương",
  "970415": "Vietinbank - Ngân hàng TMCP Công thương Việt Nam",
  "970416": "ACB - Ngân hàng TMCP Á Châu",
  "970418": "BIDV - Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
  "970422": "MB - Ngân hàng TMCP Quân đội",
  "970426": "MSB - Ngân hàng TMCP Hàng hải",
  "970429": "SCB - Ngân hàng TMCP Sài Gòn",
  "970432": "VP Bank - Ngân hàng TMCP Việt Nam Thịnh Vượng",
  "970433": "VietBank - Ngân hàng TMCP Việt Nam Thương Tín ",
  "970436": "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam",
  "970443": "SHB - Ngân hàng TMCP Sài Gòn - Hà Nội ",
  "970448": "OCB - Ngân hàng TMCP Phương Đông",
};

const getBankName = (bankId) => {
  return bankList[bankId] || "Unknown Bank";
};

export default function CheckOut() {
  const location = useLocation();
  const { plan, qrCode, amount, note, bankAccount, bankId } = location.state || {};

  // Get bank name from bankId
  const bankName = getBankName(bankId);

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Check Out - {plan} user plan</h2>
      {qrCode ? (
        <div className="checkout-content">
          <div className="checkout-box">
            {/* Left side - QR Code */}
            <div className="checkout-qr-section">
              <img src={qrCode} alt="Payment QR Code" className="checkout-qr-image" />
            </div>

            {/* Right side - Payment Details */}
            <div className="checkout-details-section">
              <h3>Payment Details</h3>

              <p className='checkout-Dtitle'>Bank: </p>
              <p className='checkout-Dcontent'> <strong>{bankName || "N/A"} </strong></p>

              <p className='checkout-Dtitle'>Account Number: </p>
              <p className='checkout-Dcontent'><strong>{bankAccount || "N/A"} </strong></p>

              <p className='checkout-Dtitle'>Account Owner: </p>
              <p className='checkout-Dcontent'><strong>{"NGUYEN MINH LUAT"} </strong></p>

              <p className='checkout-Dtitle'>Amount: </p>
              <p className='checkout-Dcontent'><strong>{amount ? `${amount} VND` : "N/A"} </strong></p>

              <p className='checkout-Dtitle'>Description: </p>
              <p className='checkout-Dcontent'><strong>{note || "No additional notes"} </strong></p>
            </div>
          </div>

          {/* Caution note */}
          <div className="checkout-user-warning">
            <p>⚠️ Noted: Double check the <strong>amount</strong> and <strong>bank account holder</strong> to avoid mistakes</p>
          </div>

          {/* Confirm transaction bar */}
          <div className="checkout-search-bar">
            <input
              type="text"
              placeholder="Enter transaction id here"
              // value={}
              // onChange={}
              className="checkout-input"
            />
            <button className="search-btn">
              <img src={MagnifyingGlass} alt="Search Icon" className="checkout-seach-icon" />
              Search
            </button>
          </div>

        </div>
      ) : (
        <p className="checkout-error-message">Failed to generate QR code.</p>
      )}
    </div>
  );
}
