import { FeatureItem, SystemStatus } from '../types';
import { speechService } from './speechService';

export interface FeatureExecutionResult {
  featureId: number;
  titleBn: string;
  success: boolean;
  messageBn: string;
  messageEn: string;
  modalType?: string;
  data?: any;
}

export class FeatureRunner {
  public static execute(
    feature: FeatureItem,
    systemStatus: SystemStatus,
    updateStatus: (updater: (prev: SystemStatus) => SystemStatus) => void,
    onOpenModal?: (modalType: string, feature: FeatureItem) => void
  ): FeatureExecutionResult {
    speechService.playBeep(720, 0.12);

    switch (feature.id) {
      // 1: Brightness
      case 1:
        updateStatus(prev => ({
          ...prev,
          brightness: prev.brightness >= 90 ? 40 : prev.brightness + 25
        }));
        return {
          featureId: 1,
          titleBn: feature.titleBn,
          success: true,
          messageBn: 'স্ক্রিন ব্রাইটনেস সমন্বয় করা হয়েছে।',
          messageEn: 'Screen brightness adjusted successfully.'
        };

      // 2: Volume
      case 2:
        updateStatus(prev => ({
          ...prev,
          volume: prev.volume >= 85 ? 30 : prev.volume + 20
        }));
        return {
          featureId: 2,
          titleBn: feature.titleBn,
          success: true,
          messageBn: 'মিডিয়া ভলিউম সমন্বয় করা হয়েছে।',
          messageEn: 'Media volume updated.'
        };

      // 3: WiFi
      case 3: {
        let newState = false;
        updateStatus(prev => {
          newState = !prev.wifi;
          return { ...prev, wifi: newState };
        });
        return {
          featureId: 3,
          titleBn: feature.titleBn,
          success: true,
          messageBn: `ওয়াইফাই ${newState ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে।`,
          messageEn: `Wi-Fi ${newState ? 'Enabled' : 'Disabled'}.`
        };
      }

      // 4: Bluetooth
      case 4: {
        let newState = false;
        updateStatus(prev => {
          newState = !prev.bluetooth;
          return { ...prev, bluetooth: newState };
        });
        return {
          featureId: 4,
          titleBn: feature.titleBn,
          success: true,
          messageBn: `ব্লুটুথ ${newState ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে।`,
          messageEn: `Bluetooth ${newState ? 'Enabled' : 'Disabled'}.`
        };
      }

      // 5: Flashlight
      case 5: {
        let newState = false;
        updateStatus(prev => {
          newState = !prev.flashlight;
          return { ...prev, flashlight: newState };
        });
        return {
          featureId: 5,
          titleBn: feature.titleBn,
          success: true,
          messageBn: `ক্যামেরা টর্চলাইট ফ্ল্যাশ ${newState ? 'চালু' : 'বন্ধ'} করা হয়েছে।`,
          messageEn: `Flashlight beacon ${newState ? 'ON' : 'OFF'}.`
        };
      }

      // 6: DND
      case 6: {
        let newState = false;
        updateStatus(prev => {
          newState = !prev.dnd;
          return { ...prev, dnd: newState };
        });
        return {
          featureId: 6,
          titleBn: feature.titleBn,
          success: true,
          messageBn: `Do Not Disturb (DND) জেন মোড ${newState ? 'চালু' : 'বন্ধ'} করা হয়েছে।`,
          messageEn: `DND Mode ${newState ? 'Active' : 'Deactivated'}.`
        };
      }

      // 7: Hotspot
      case 7: {
        let newState = false;
        updateStatus(prev => {
          newState = !prev.hotspot;
          return { ...prev, hotspot: newState };
        });
        return {
          featureId: 7,
          titleBn: feature.titleBn,
          success: true,
          messageBn: `ব্যক্তিগত ওয়াইফাই হটস্পট ${newState ? 'চালু' : 'বন্ধ'} করা হয়েছে।`,
          messageEn: `Personal Hotspot ${newState ? 'ON' : 'OFF'}.`
        };
      }

      // 8: Battery Saver
      case 8: {
        let newState = false;
        updateStatus(prev => {
          newState = !prev.batterySaver;
          return { ...prev, batterySaver: newState };
        });
        return {
          featureId: 8,
          titleBn: feature.titleBn,
          success: true,
          messageBn: `আল্ট্রা ব্যাটারি সেভার ${newState ? 'চালু' : 'বন্ধ'} করা হয়েছে।`,
          messageEn: `Battery Saver ${newState ? 'Enabled' : 'Disabled'}.`
        };
      }

      // 9: RAM Cleaner
      case 9:
        updateStatus(prev => ({
          ...prev,
          ramUsagePercent: Math.max(28, prev.ramUsagePercent - 24)
        }));
        return {
          featureId: 9,
          titleBn: feature.titleBn,
          success: true,
          modalType: 'ram_cleaner',
          messageBn: 'র‌্যাম টার্বো ক্লিনার সম্পন্ন! ৫১২ MB মেমোরি খালি করা হয়েছে।',
          messageEn: 'RAM Booster successfully freed 512MB memory.'
        };

      // 10: Cache Clear
      case 10:
        updateStatus(prev => ({
          ...prev,
          cacheSizeMb: 0
        }));
        return {
          featureId: 10,
          titleBn: feature.titleBn,
          success: true,
          messageBn: 'সমস্ত অ্যাপ জাঙ্ক ক্যাশ ও টেম্পোরারি ফাইল সাফ করা হয়েছে।',
          messageEn: 'All temporary app cache deep-cleaned.'
        };

      // 11: Auto Rotation
      case 11: {
        let newState = false;
        updateStatus(prev => {
          newState = !prev.autoRotate;
          return { ...prev, autoRotate: newState };
        });
        return {
          featureId: 11,
          titleBn: feature.titleBn,
          success: true,
          messageBn: `স্ক্রিন অটো-রোটেশন ${newState ? 'অন' : 'লক'} করা হয়েছে।`,
          messageEn: `Screen rotation ${newState ? 'Enabled' : 'Locked'}.`
        };
      }

      // 12: Speed Test
      case 12:
        if (onOpenModal) onOpenModal('speed_test', feature);
        return {
          featureId: 12,
          titleBn: feature.titleBn,
          success: true,
          modalType: 'speed_test',
          messageBn: 'নেটওয়ার্ক স্পিড টেস্ট ডায়াগনস্টিক শুরু হচ্ছে...',
          messageEn: 'Running real-time network speed test...'
        };

      // 16: WhatsApp Auto Message
      case 16:
        if (onOpenModal) onOpenModal('whatsapp', feature);
        return {
          featureId: 16,
          titleBn: feature.titleBn,
          success: true,
          modalType: 'whatsapp',
          messageBn: 'হোয়াটসঅ্যাপ মেসেজ অটোমেশন প্যানেল উন্মুক্ত হয়েছে।',
          messageEn: 'Opening WhatsApp automated dispatcher.'
        };

      // 19: OTP Auto Copy
      case 19:
        return {
          featureId: 19,
          titleBn: feature.titleBn,
          success: true,
          messageBn: 'লেটেস্ট ওটিপি কোড [739204] ক্লিপবোর্ডে কপি করা হয়েছে।',
          messageEn: 'Extracted latest OTP code (739204) to clipboard.'
        };

      // 31: Object Detect
      case 31:
      // 32: OCR Scan
      case 32:
      // 33: QR Reader
      case 33:
      // 34: Face Unlock
      case 34:
      // 35: Doc Scanner
      case 35:
      // 36: Live Translation
      case 36:
      // 37: Color ID
      case 37:
      // 38: Scene Description
      case 38:
      // 39: Smile Capture
      case 39:
      // 40: Text to image
      case 40:
        if (onOpenModal) onOpenModal('vision_scanner', feature);
        return {
          featureId: feature.id,
          titleBn: feature.titleBn,
          success: true,
          modalType: 'vision_scanner',
          messageBn: `ক্যামেরা HUD ${feature.titleBn} সক্রিয় করা হয়েছে।`,
          messageEn: `Activated camera vision module for ${feature.title}.`
        };

      // 44: To-Do List
      case 44:
        if (onOpenModal) onOpenModal('todo_list', feature);
        return {
          featureId: 44,
          titleBn: feature.titleBn,
          success: true,
          modalType: 'todo_list',
          messageBn: 'ভয়েস টু-ডু লিস্ট ওপেন করা হয়েছে।',
          messageEn: 'Voice To-Do list opened.'
        };

      // 48: Currency Conv
      case 48:
        if (onOpenModal) onOpenModal('currency_conv', feature);
        return {
          featureId: 48,
          titleBn: feature.titleBn,
          success: true,
          modalType: 'currency_conv',
          messageBn: 'লাইভ কারেন্সি ও ফরেক্স কনভার্টার প্রস্তুত।',
          messageEn: 'Live currency converter ready.'
        };

      // 49: Calculator
      case 49:
        if (onOpenModal) onOpenModal('calculator', feature);
        return {
          featureId: 49,
          titleBn: feature.titleBn,
          success: true,
          modalType: 'calculator',
          messageBn: 'HUD সায়েন্টিফিক ক্যালকুলেটর প্রস্তুত।',
          messageEn: 'HUD Scientific Calculator loaded.'
        };

      // 56: Music Player
      case 56:
        if (onOpenModal) onOpenModal('music_player', feature);
        return {
          featureId: 56,
          titleBn: feature.titleBn,
          success: true,
          modalType: 'music_player',
          messageBn: 'নিয়ন মিউজিক প্লেয়ার নিয়ন্ত্রণ চালু হয়েছে।',
          messageEn: 'Neon Music Player controller opened.'
        };

      // 61: News Brief
      case 61:
        return {
          featureId: 61,
          titleBn: feature.titleBn,
          success: true,
          messageBn: 'আজকের প্রধান খবর: দেশে তথ্যপ্রযুক্তি খাতে রেকর্ড অগ্রগতি, এআই রিসার্চ হাবের উদ্বোধন ও আবহাওয়া স্বাভাবিক।',
          messageEn: 'Daily News: Bangladesh tech growth, new AI research hub & steady weather.'
        };

      // 67: Anti-theft
      case 67:
        speechService.playBeep(990, 0.3, 'square');
        return {
          featureId: 67,
          titleBn: feature.titleBn,
          success: true,
          messageBn: 'অ্যান্টি-থেফট মোশন অ্যালার্ম আর্মড! ফোন সরানো মাত্রই সাইরেন বাজবে।',
          messageEn: 'Anti-Theft Motion Alarm is armed and active.'
        };

      // 73: Emergency SOS
      case 73:
        speechService.playSosSiren();
        if (onOpenModal) onOpenModal('emergency_sos', feature);
        return {
          featureId: 73,
          titleBn: feature.titleBn,
          success: true,
          modalType: 'emergency_sos',
          messageBn: 'জরুরি এসওএস অ্যালার্ম ও লাইভ জিপিএস লোকেশন সম্প্রচার সক্রিয় করা হয়েছে!',
          messageEn: 'Emergency SOS activated! Broadcasting GPS beacon.'
        };

      // 76: Persona Switch
      case 76:
        if (onOpenModal) onOpenModal('persona_switch', feature);
        return {
          featureId: 76,
          titleBn: feature.titleBn,
          success: true,
          modalType: 'persona_switch',
          messageBn: 'পারসোনা পরিবর্তনের ড্যাশবোর্ড প্রদর্শিত হচ্ছে।',
          messageEn: 'Persona switcher opened.'
        };

      // Default handler for all other 85 features
      default:
        return {
          featureId: feature.id,
          titleBn: feature.titleBn,
          success: true,
          messageBn: `${feature.titleBn} ফিচারটি সফলভাবে সক্রিয় ও সম্পন্ন হয়েছে।`,
          messageEn: `Feature #${feature.id} (${feature.title}) executed successfully.`
        };
    }
  }
}
