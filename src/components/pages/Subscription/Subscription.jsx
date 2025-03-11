import React, { useState } from 'react';
import './Subscription.css';
import { useNavigate } from "react-router-dom";
import { generatePaymentQR } from '../../../server/api';
// Import Icon
import Folder from '../../../assets/Icon_fill/Folder.svg';
import CrownIcon from '../../../assets/Icon_fill/SubscribeNow.svg';
import TryBeta from '../../../assets/Icon_fill/EnhanceNote.svg';
import CreateNote from '../../../assets/Icon_fill/UntitledNote.svg';
import NoteStorage from '../../../assets/Icon_fill/NoteGallery.svg';
import InlimitWord from '../../../assets/Icon_fill/UnlimitedWord.svg';
import NoteEnhance from '../../../assets/Icon_line/FindYourOwnNote.svg';
import MostLike_tag from '../../../assets/Icon_fill/MostLike_tag.svg';
// Import Gradient Icon
import GrCrownIcon from '../../../assets/Icon_fill-Gradient/SubscribeNow.svg';

const planFeatures = {
  free: [
    {
      icon: CreateNote,
      text: 'Create and store notes with limitations',
      className: 'icon-create-note-style', // Custom class for styling
    },
    {
      icon: NoteStorage,
      text: 'Maximum note storage 100MB',
      className: 'icon-note-storage-style',
    },
    {
      icon: InlimitWord,
      text: 'Unlimited words per note',
      className: 'icon-unlimited-words-style',
    },
    {
      icon: NoteEnhance,
      text: 'Smart note enhancement 10 times per month',
      className: 'icon-note-enhance-style',
    },
  ],
  learners: [
    {
      icon: CreateNote,
      text: 'Smart Create and store notes',
      className: 'icon-create-note-style',
    },
    {
      icon: NoteStorage,
      text: 'Note storage up to 5GB (approximately 10,000 notes)',
      className: 'icon-note-storage-style',
    },
    {
      icon: InlimitWord,
      text: 'Unlimited words per note',
      className: 'icon-unlimited-words-style',
    },
    {
      icon: NoteEnhance,
      text: 'Smart note enhancement 2 million tokens/month ~1000 times',
      className: 'icon-note-enhance-style',
    },
  ],
  pro: [
    {
      icon: CreateNote,
      text: 'Smart Create and store notes',
      className: 'icon-create-note-style',
    },
    {
      icon: NoteStorage,
      text: 'Note storage up to 10GB (approximately 20,000 notes)',
      className: 'icon-note-storage-style',
    },
    {
      icon: InlimitWord,
      text: 'Unlimited words per note',
      className: 'icon-unlimited-words-style',
    },
    {
      icon: NoteEnhance,
      text: 'Smart note enhancement 4 million tokens/month ~2000 times',
      className: 'icon-note-enhance-style',
    },
  ],
  // unlimited: [
  //   {
  //     icon: Folder,
  //     text: 'All features, no limits!',
  //     className: 'icon-unlimited-style',
  //   },
  // ],
};

export default function Subscription() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state

  const handleLearnerCheckOut = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No token found, please log in.");
      setLoading(false);
      return;
    }

    try {
      const qrCode = await generatePaymentQR(
        20000,
        "Subscription for Learners",
        "1015530875", // Bank Account
        "970436", // Bank ID
        token
      );

      console.log("QR Code Response:", qrCode);

      if (qrCode && qrCode.qr_image) {
        navigate("/checkOut", {
          state: {
            plan: "Learner",
            qrCode: qrCode.qr_image,
            amount: "20.000",
            note: "Subscription for Learners",
            bankAccount: "1015530875",
            bankId: "970436",
          },
        });
      } else {
        console.error("QR Code data is missing or invalid.");
      }
    } catch (error) {
      console.error("Failed to generate QR Code:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProUserCheckOut = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No token found, please log in.");
      setLoading(false);
      return;
    }

    try {
      const qrCode = await generatePaymentQR(
        59000,
        "Subscription for Pro Users",
        "1015530875", // Bank Account
        "970436", // Bank ID
        token
      );

      console.log("QR Code Response:", qrCode);

      if (qrCode && qrCode.qr_image) {
        navigate("/checkOut", {
          state: {
            plan: "Pro",
            qrCode: qrCode.qr_image,
            amount: "59.000",
            note: "Subscription for Pro Users",
            bankAccount: "1015530875",
            bankId: "970436",
          },
        });
      } else {
        console.error("QR Code data is missing or invalid.");
      }
    } catch (error) {
      console.error("Failed to generate QR Code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-container">
      <h1 className="subscription-title">Choose Your Plan</h1>
      <div className="subscription-plans">
        {/* Free Plan */}
        <div className="subscription-card free">
          <img src={Folder} alt={'Folder Icon'} className="subscription-folder-icon" />
          <h2 className="subscription-card-title">FREE</h2>
          <p className="subscription-price">0 VND <span className='subscription-time'>/month</span></p>
          <p className="subscription-duration">Forever</p>
          <ul className="subscription-features">
            {planFeatures.free.map((feature, index) => (
              <li key={index}>
                <img src={feature.icon} alt={feature.text} className={`subscription-feature-icon ${feature.className}`} />
                {feature.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Learners Plan */}
        <div className="subscription-card learners">
          <div className="recommended-tag">
            <img src={MostLike_tag} alt="Recommended Icon" />
          </div>
          <img src={GrCrownIcon} alt={'Crown Icon'} className="sLearner-crown-icon" />
          <h2 className="subscription-card-title s-learner">For Learners</h2>
          <p className="subscription-price">20,000 VND <span className='subscription-time'>/month</span></p>
          <p className="subscription-duration">Expected price</p>
          <ul className="subscription-features">
            {planFeatures.learners.map((feature, index) => (
              <li key={index}>
                <img src={feature.icon} alt={feature.text} className={`subscription-feature-icon ${feature.className}`} />
                {feature.text}
              </li>
            ))}
          </ul>
          <button className="subscription-button" onClick={handleLearnerCheckOut}>
            {/* css for tryBeta-icon is in Smartlearning.css */}
            <img src={TryBeta} alt="Try Beta Icon" className="tryBeta-icon" />
            {loading ? "Processing..." : "Subscribe now"}
          </button>
        </div>

        {/* Pro Users Plan */}
        <div className="subscription-card pro">
          <img src={CrownIcon} alt={'Crown Icon'} className="sProUser-crown-icon" />
          <h2 className="subscription-card-title s-proUser">For Pro Users</h2>
          <p className="subscription-price">59,000 VND <span className='subscription-time'>/month</span></p>
          <p className="subscription-duration">Expected price</p>
          <ul className="subscription-features">
            {planFeatures.pro.map((feature, index) => (
              <li key={index}>
                <img src={feature.icon} alt={feature.text} className={`subscription-feature-icon ${feature.className}`} />
                {feature.text}
              </li>
            ))}
          </ul>
          <button className="subscription-button" onClick={handleProUserCheckOut}>
            {/* css for tryBeta-icon is in Smartlearning.css */}
            <img src={TryBeta} alt="Try Beta Icon" className="tryBeta-icon" />
            {loading ? "Processing..." : "Subscribe now"}
          </button>
        </div>

        {/* Unlimited Plan */}
        {/* <div className="subscription-card unlimited">
          <img src={CrownIcon} alt={'Crown Icon'} className="sUnlimited-crown-icon " />
          <h2 className="subscription-card-title s-unlimited">Unlimited</h2>
          <p className="subscription-price">3,150,000 VND <span className='subscription-time'>/year</span></p>
          <p className="subscription-duration">Expected price</p>
          <div className="subscription-features unlimited-features">
            <p>All features, no limits!</p>
            <div className='subscription-tiny-icons'>
              <img src={CreateNote} alt={'CreateNote Icon'} className="subscription-feature-icon icon-create-note-style " />
              <img src={NoteStorage} alt={'NoteStorage Icon'} className="subscription-feature-icon icon-note-storage-style" />
              <img src={InlimitWord} alt={'InlimitWord Icon'} className="subscription-feature-icon icon-unlimited-words-style" />
              <img src={NoteEnhance} alt={'NoteEnhance Icon'} className="subscription-feature-icon icon-note-enhance-style" />
            </div>
          </div>
          <button className="subscription-button">
            <img src={TryBeta} alt="Try Beta Icon" className="tryBeta-icon" />
            Subscribe
          </button>
        </div> */}
      </div>
    </div>
  )
}
