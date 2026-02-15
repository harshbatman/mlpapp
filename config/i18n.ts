import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "Home": "Home",
            "Post": "Post",
            "Profile": "Profile",
            "About Us": "About Us",
            "Language": "Language",
            "Logout": "Logout",
            "Welcome": "Welcome",
            "Find Dream": "Find your dream",
            "Property": "Property",
            "Search": "Search",
            "Categories": "Categories",
            "Join MAHTO": "Join MAHTO",
            "Land to Lending": "Land to Lending",
            "Mission": "Our Mission",
            "Vision": "Our Vision",
            "Sabka Sar": "A roof over every head — not a roof, but own roof.",
            "Global OS": "To raise living standards by becoming the global operating system for home building.",
            "Marketplace": "Worker, Contractor & Shops Marketplace",
            "Mine": "Full-stack Construction & Renovation Services",
            "Home Loans": "Home Loans Marketplace",
            "Land Properties": "Land & Property Listings"
        }
    },
    hi: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट करें",
            "Profile": "प्रोफ़ाइल",
            "About Us": "हमारे बारे में",
            "Language": "भाषा",
            "Logout": "लॉगआउट",
            "Welcome": "स्वागत है",
            "Find Dream": "अपना सपनों का ढूंढें",
            "Property": "संपत्ति",
            "Search": "खोजें",
            "Categories": "श्रेणियाँ",
            "Join MAHTO": "MAHTO से जुड़ें",
            "Land to Lending": "ज़मीन से लोन तक",
            "Mission": "हमारा मिशन",
            "Vision": "हमारा विजन",
            "Sabka Sar": "सबका सर अपनी छत।",
            "Global OS": "घर बनाने के लिए वैश्विक ऑपरेटिंग सिस्टम बनकर जीवन स्तर को ऊपर उठाना।",
            "Marketplace": "श्रमिक, ठेकेदार और दुकान बाज़ार",
            "Mine": "फुल-स्टैक निर्माण और नवीनीकरण सेवाएँ",
            "Home Loans": "होम लोन बाज़ार",
            "Land Properties": "भूमि और संपत्ति लिस्टिंग"
        }
    },
    pa: {
        translation: {
            "Home": "ਹੋਮ",
            "Post": "ਪੋਸਟ ਕਰੋ",
            "Profile": "ਪ੍ਰੋਫਾਈਲ",
            "About Us": "ਸਾਡੇ ਬਾਰੇ",
            "Language": "ਭਾਸ਼ਾ",
            "Logout": "ਲੌਗਆਉਟ",
            "Sabka Sar": "ਸਭ ਦਾ ਸਿਰ ਆਪਣੀ ਛੱਤ।",
            "Find Dream": "ਆਪਣਾ ਸੁਪਨਾ ਲੱਭੋ"
        }
    },
    ur: {
        translation: {
            "Home": "ہوم",
            "Post": "پوسٹ کریں",
            "Profile": "پروفائل",
            "About Us": "ہمارے بارے میں",
            "Language": "زبان",
            "Logout": "لاگ آؤٹ",
            "Sabka Sar": "سب کا سر اپنی چھت۔",
            "Find Dream": "اپنا خواب تلاش کریں"
        }
    },
    bn: {
        translation: {
            "Home": "হোম",
            "Post": "পোস্ট করুন",
            "Profile": "প্রোফাইল",
            "About Us": "আমাদের সম্পর্কে",
            "Language": "ভাষা",
            "Logout": "লগআউট",
            "Sabka Sar": "সবার মাথার ওপর নিজের ছাদ।"
        }
    },
    mr: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट करा",
            "Profile": "प्रोफाइल",
            "About Us": "आमच्याबद्दल",
            "Language": "भाषा",
            "Logout": "लॉगआउट",
            "Sabka Sar": "सर्वांचे डोके स्वतःच्या छताखाली।"
        }
    },
    gu: {
        translation: {
            "Home": "હોમ",
            "Post": "પોસ્ટ કરો",
            "Profile": "પ્રોફાઇલ",
            "About Us": "અમારા વિશે",
            "Language": "ભાષા",
            "Logout": "લૉગઆઉટ"
        }
    },
    kn: {
        translation: {
            "Home": "ಮನೆ",
            "Post": "ಪೋಸ್ಟ್ ಮಾಡಿ",
            "Profile": "ಪ್ರೊಫೈಲ್",
            "About Us": "ನಮ್ಮ ಬಗ್ಗೆ",
            "Language": "ಭಾಷೆ",
            "Logout": "ಲಾಗ್ಔಟ್"
        }
    },
    te: {
        translation: {
            "Home": "హోమ్",
            "Post": "పోస్ట్ చేయండి",
            "Profile": "ప్రొఫైల్",
            "About Us": "మా గురించి",
            "Language": "భాష",
            "Logout": "లాగ్అవుట్"
        }
    },
    ml: {
        translation: {
            "Home": "ഹോം",
            "Post": "പോസ്റ്റ് ചെയ്യുക",
            "Profile": "പ്രൊഫൈൽ",
            "About Us": "ഞങ്ങളെക്കുറിച്ച്",
            "Language": "ഭാഷ",
            "Logout": "ലോഗൗട്ട്"
        }
    },
    or: {
        translation: {
            "Home": "ହୋମ୍",
            "Post": "ପୋଷ୍ଟ୍ କରନ୍ତୁ",
            "Profile": "ପ୍ରୋଫାଇଲ୍",
            "About Us": "ଆମ ବିଷୟରେ",
            "Language": "ଭାଷା",
            "Logout": "ଲଗ୍ ଆଉଟ୍"
        }
    },
    ne: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट गर्नुहोस्",
            "Profile": "प्रोफाइल",
            "About Us": "हाम्रो बारेमा",
            "Language": "भाषा",
            "Logout": "लॉगआउट"
        }
    },
    bho: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट करीं",
            "Profile": "प्रोफाइल",
            "About Us": "हमार बारे में",
            "Language": "भाषा",
            "Logout": "लॉगआउट",
            "Sabka Sar": "सबके सर आपन छत।"
        }
    },
    har: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट कर",
            "Profile": "प्रोफाइल",
            "About Us": "म्हारे बारे में",
            "Language": "बोली",
            "Logout": "लॉगआउट",
            "Sabka Sar": "सबका सर अपनी छत।"
        }
    },
    raj: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट करो",
            "Profile": "प्रोफाइल",
            "About Us": "म्हारे बारे में",
            "Language": "भाषा",
            "Logout": "लॉगआउट",
            "Sabka Sar": "सगळां रो सिर आपणी छत।"
        }
    },
    mai: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट करू",
            "Profile": "प्रोफाइल",
            "About Us": "हमर बारे में",
            "Language": "भाषा",
            "Logout": "लॉगआउट"
        }
    },
    ks: {
        translation: {
            "Home": "ہوم",
            "Post": "پوسٹ کٔریو",
            "Profile": "پروفائل",
            "About Us": "سانیِ متعلق",
            "Language": "زبان",
            "Logout": "لاگ آؤٹ"
        }
    }
};

const initI18n = async () => {
    let savedLanguage = await AsyncStorage.getItem('user-language');

    if (!savedLanguage) {
        savedLanguage = Localization.getLocales()[0].languageCode || 'en';
    }

    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: savedLanguage,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
        });
};

initI18n();

export default i18n;
