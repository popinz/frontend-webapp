(function(){
    var translate = angular.module("translateModule", []);
    translate.service('translateService', ["$rootScope", function($rootScope) {
        var texts = {
        //common buttons
            'EDIT' : {'en' : 'Edit', 'he' : 'עריכה'},
            'SAVE' : {'en' : 'Save', 'he' : 'שמירה'},
            'CANCEL' : {'en' : "Cancel", 'he' : 'ביטול'},
            'SEND' : {'en' : 'Send', 'he' : 'שלח'},
        //signup forms
            //headers
            'HEADER_START' : {'en': 'Join Popinz', 'he': 'הצטרפות לפופינז'},
            'HEADER_1' : {'en' : 'Create your account', 'he' : 'יצירת משתמש באתר'},
            "PARENT_INFO_TEXT_HEADER" : {'en' : 'Welcome to Popinz, where finding a top notch, reliable and experienced babysitter in your neighborhood is a reality, even on short notice!', 'he' : 'ברוכים הבאים לפופינז, מצאו בייביסיטר אמינה ומנוסה בשכונה שלכם, אפילו בהתראה קצרה!'},
            "PARENT_INFO_TEXT1" : {'en' : 'In order to guarantee the best service, we’ll only launch when we meet our target of 1,000 babysitters in Jerusalem.', 'he' : 'על מנת להבטיח את השירות הטוב ביותר, נצא לדרך כשיהיו ל-1000 בייביסיטרים בירושלים והסביבה.'},
            "PARENT_INFO_TEXT2" : {'en' : 'Early signup is now open, signup with email or Facebook and be the first to know when we launch.', 'he' : 'ההרשמה המוקדמת פתוחה, הרשמו באמצעות כתובת המייל או חשבון הפייסבוק שלכם ותהיו הראשונים לדעת כאשר נשיק את האתר.'},
            "SITTER_INFO_TEXT_HEADER1" : {'en' : 'Welcome to Popinz, where finding work is easy as pie! The perfect job could be around the corner- what are you waiting for?', 'he' : 'ברוכים הבאים לפופינז! מחפשים עבודה? הגעתם למקום הנכון. פה תמצאו מגוון משרות חד פעמיות וקבועות. המשרה הבאה שלכם מעבר לפינה, אז למה אתם מחכים?'},
            "SITTER_INFO_TEXT_HEADER2" : {'en' : "It’s time to create your profile!", 'he' : 'צרו את הפרופיל שלכם'},
            "SITTER_INFO_TEXT_HEADER3" : {'en' : "Showcase your personality and skills to your next employers.", 'he' : 'הציגו את אישיותכם ואת הניסיון שלכם בצורה הטובה ביותר למעסיקים הבאים שלכם'},
            "SITTER_INFO_TEXT1" : {'en' : 'Take a few minutes to create a unique profile that shows employers your experience and skills. After this, finding a job (or two) will be quick and easy.', 'he' : 'קחו כמה דקות כדי ליצור פרופיל אישי שיציג לראווה את כישוריכם וניסיונכם על הצד הטוב ביותר. פרופיל עשיר יקרוץ להורים ולכם יישאר רק לבחור.'},
            "SITTER_INFO_TEXT2" : {'en' : "We’re launching very soon, and until then your profile is private. Use this time to create a great profile, you can also come back and edit your details after you’ve signed up. Stay tuned for updates!", 'he' : "אנחנו משיקים בקרוב מאוד, עד אז הפרופיל שלכם יהיה פרטי ולא יוצג לאף אחד חוץ מכם. נצלו את הזמן עד ההשקה כדי ליצור פרופיל מעולה, תוכלו גם לחזור ולערוך את הפרטים שלכם לאחר סיום ההרשמה. צפו לעדכונים בקרוב!"},
            'HEADER_2' : {'en' : 'Profile picture' , 'he' : 'תמונת פרופיל'},
            'HEADER_3' : {'en' : 'Location', 'he': 'מיקום'},
            'HEADER_3a' : {'en' : 'Popinz is currently available in the Jerusalem area', 'he' : 'פופינז פועל כרגע רק בירושלים והסביבה'},
            'HEADER_4' : {'en' : 'About you', 'he' : 'ספרי על עצמך'},
            'HEADER_5' : {'en' : 'Your Skills and Experience', 'he' : 'הכישורים והניסיון שלך'},
            'HEADER_6' : {'en' : 'When do you want to work?', 'he' : 'שעות העבודה שלך'},
            'HEADER_6a' : {'en' : 'What kind of job are you searching for?', 'he' : 'איזה סוג משרה את/ה מחפש/ת'},
            'HEADER_7' : {'en' : 'Where would you be interested in working?', 'he' : 'אזורי העבודה שלך'},
            'HEADER_7a' : {'en' : "Don't miss new jobs - tell us where you want to work and we'll notify you about new work in your area", 'he' : 'אל תפספסי משרות מתאימות - תגידי לנו איפה את רוצה לעבוד ונעדכן אותך על משרות חדשות באזור'},
            'HEADER_8' : {'en' : "What languages do you speak?", 'he' : "אילו שפות את/ה מדבר/ת?"},
            "SEE_YOU_LATER_HEADER" : {'en' : 'Thanks for signing up, we have saved your details.', 'he' : 'תודה שנרשמת, הפרטים שלך נשמרו.'},
            "SEE_YOU_LATER_TEXT1" : {'en' : 'Come back and pick up where you left off next time - all you need to do is log in.', 'he' : 'הכנס/י עם שם המשתמש והסיסמא בפעם הבאה והמשיכ/י מהיכן שהפסקת.'},
            "SEE_YOU_LATER_TEXT2" : {'en' : 'We are launching soon and then you’ll be able to browse jobs. Until then you have time to make your profile sparkle', 'he' : 'האתר יצא לדרך בקרוב ואז תוכל/י לצפות בהצעות עבודה. עד אז, ודא/י שהפרופיל שלך מושלם.'},
            "MORE_INFO" : {'en' : 'More info', 'he' : 'מידע נוסף'},

            //buttons
            'FB_SIGNUP' : {'en' : 'Sign up with Facebook', 'he' : 'הרשמה עם פייסבוק'},
            'FB_LOGIN' : {'en' : 'Login with Facebook', 'he' : 'כניסה עם פייסבוק'},
            'MAIL_SIGNUP' : {'en' : 'Sign up with your email', 'he' : 'הרשמה עם כתובת דוא"ל'},
            'MAIL_LOGIN' : {'en' : 'Login with your email', 'he' : 'כניסה עם כתובת דוא"ל'},
            'GET_STARTED_BTN' : {'en' : 'Get Started!', 'he' : 'יאללה מתחילים!'},
            'SAVE_IMAGE' : {'en' : 'Save this image', 'he' : 'שמירת תמונה'},
            'SAVE_AND_RETURN' : {'en' : 'Save and return later', 'he' : 'שמר/י והמשיכ/י מאוחר יותר'},
            'NEXT' : {'en' : 'Next', 'he' : 'הבא'},

            // passwords, accounts, resets
            'CURRENT_PASSWORD' : {'en' : 'Current password', 'he' : 'סיסמה נוכחית'},
            'NEW_PASSWORD' : {'en' : 'New password', 'he' : 'סיסמה חדשה'},
            'PASSWORD_RESET' : {'en' : 'Enter a new password', 'he' : 'נא הקש/י סיסמא חדשה'},
            'RESET' : {'en' : 'Reset', 'he' : 'עדכון סיסמא'},
            'I_FORGOT_MY_PASSWORD' : {'en' : 'I forgot my password', 'he' : 'שכחתי את הסיסמא שלי'},
            'RESET_MY_PASSWORD' : {'en' : 'Reset my password', 'he' : 'עדכון סיסמא'},
            'CONFIRM_PASSWORD' : {'en' : 'Confirm password', 'he' : 'אישור סיסמא'},
            'PASSWORD_DOES_NOT_MATCH' : {'en' : 'Password does not match', 'he' : 'הסיסמאות אינן תואמות'},
            'PASSWORD_RESET_SENT' : {'en' : 'Your password reset request was sent. Please check your email and follow the embedded link. You may need to check your spam folder as well. This link will expire in 24 hours.',
            'he' : 'בקשת עדכון הסיסמא שלך נשלחה. נא בדק/י את תיבת המייל שלך ולחצ/י על הקישור. ייתכן שהמייל יגיע לתיקיית הזבל שלך. הקישור תקף ל-24 שעות.'},
            'EMAIL_CONFIRM_SENT' :  {'en' : 'We just sent you an email to validate your account (You may need to check your spam folder). ', 'he' : 'שלחנו לך מייל כדי לאשר את הרשמתך (ייתכן שהוא הגיע לתיקיית הזבל)'},
            'CONFIRM' : { 'en' : 'Confirm', 'he' : 'אישור'},
            'INVALID_CONFIRMATION' : { 'en' : 'The confirmation code was invalid.', 'he' : 'הקוד שהוזן אינו תקין'},
            'CONFIRMATION_CODE' : {'en' : 'Enter your confirmation code', 'he' : 'הזן את הקוד שקיבלת בתיבה'},

            //fields
            'FIRST_NAME' : {'en' : 'First Name', 'he' : 'שם פרטי'},
            'LAST_NAME' : {'en' : 'Last Name', 'he' : 'שם משפחה'},
            'EMAIL' : {'en' : 'Email', 'he' : 'כתובת דוא"ל'},
            'EMAIL_OR_USERNAME' : {'en' : 'Email or Username', 'he' : 'כתובת דוא"ל'},
            'PASSWORD' : {'en' : 'Password', 'he' : 'סיסמא'},
            'HOW_HEARD' : {'en' : 'How did you hear about us?', 'he' : 'איך שמעת עלינו?'},
            'CITY' : {'en' : "City/Town", 'he' : 'עיר'},
            'NEIGHBORHOOD' : {'en': 'Neighborhood', 'he' : 'שכונה'},
            'ZIP_CODE' : {'en' : 'Zip Code', 'he' : 'מיקוד'},
            'HOUSE_NUMBER' : {'en' : 'Number on street', 'he' : 'מספר בית'},
            'STREET' : {'en' : 'Street', 'he' : 'רחוב'},
            'MOBILE' : {'en' : 'Mobile phone', 'he' : 'טלפון סלולרי'},
            'GENDER' : {'en' : 'Gender', 'he' : 'מגדר'},
            'AGE' : {'en' : 'Age', 'he' : 'גיל'},
            'AGE_HELP' : {'en' : "You may use the site if you are at least 15 years old, according to the Israeli employment laws",
            'he' : "מותר להשתמש באתר מגיל 15 ומעלה בהתאם לחוקי ההעסקה במדינת ישראל"},
            'ABOUT_ME' : {'en' : 'Tell us about yourself', 'he' : "ספר/י על עצמך"},
            'EXPERIENCE_TEXT' : {'en' : 'Tell us about your experience', 'he' : "ספר/י על הניסיון שלך"},
            'EXPERIENCE' : {'en' : 'Experience', 'he' : 'ניסיון'},
            'SKILLS' : {'en' : 'Skills', 'he' : 'כישורים'},
            'OFFERINGS' : {'en' : 'What can you help with?', 'he' : 'במה תוכל/י לעזור?'},
            'FIRST_AID' : {'en' : 'First aid', 'he' : 'עזרה ראשונה'},

            //help texts
            'PASSWORD_HELP' : {'en': 'Please make sure your password is in English and is 8 characters or longer', 'he': 'הסיסמא צריכה להיות מורכבת מאותיות באנגלית או מספרים ובאורך של לפחות 8 תווים'},
            'PASSWORD_REQUIRED' : {'en' : 'Password is required', 'he' : ''},
            'CHECKBOX_HELP' : {'en' : 'check all that apply', 'he' : 'סמנ/י את כל מה שנכון עבורך'},
            'FIRST_AID_HELP' : {'en' : 'Check the level of your training', 'he' : 'סמנ/י את רמת ההכשרה שלך'},
            'HOMEWORK_HELP' : {'en' : "Which subject can you help with homework?", 'he' : 'באילו מקצועות תוכל/י לעזור בשיעורי בית?'},
            'EXPERIENCE_TEXT_HELP' : {'en' : 'Parents trust experienced babysitters, so tell them about your experience: babysitter (where, for whom, how long), teaching and working as a counselor, volunteering etc. - any work experience you have with children',
            'he' : 'הורים סומכים על בייביסיטרים מנוסים, אז פרט/י על הניסיון שלך: בייביסיטר (איפה, למי, כמה זמן), הדרכה במסגרות שונות, התנדבויות וכו.'},
            'ABOUT_ME_HELP' : {'en' : "Parents are more comfortable hiring babysitters they know, so tell them about yourself: current occupation, hobbies and background (e.g. Aliyah)", 'he': 'הורים מרגישים יותר בנח עם בייביסיטרים שהם מכירים, אז ספרו על עצמכם: עיסוק נוכחי (סטודנטית, תלמידה, עובדת ב), תחביבים וקצת רקע'},

            //alerts
            "SHORT_ALERT" : {'en' : "Your answer is too short!", 'he' : 'התשובה שלך קצרה מדי'},
            'MANDATORY_ALERT' : {'en' : 'This step is mandatory!', 'he' : 'הצעד הזה הוא חובה!'},
            "WRONG_PASSWORD_ALERT" : {'en' : "You are already signed up with this e-mail. Try to recall your password. If you forgot it, click here", 'he' : 'כבר נרשמת עם כתובת המייל הזו, עם סיסמא אחרת. נסי להזכר בסיסמא'},
            "GENERAL_ALERT" : {'en' : 'Something went wrong! Please, try again in 5 seconds!', 'he' : 'משהו נתקע אצלנו, נסי שוב עוד כמה שניות'},
            "SECOND_ACCOUNT_ALERT1" : {'en' : 'You already have a profile (as a ', 'he' : 'כבר קיים פרופיל בכתובת המייל הזו (בתור '},
            "SECOND_ACCOUNT_ALERT2" : {'en' : '), you cannot have two profiles at this point.', 'he' : '), כרגע לא ניתן ליצור שני פרופילים למשתמש אחד.'},
            'VALID_PASSWORD' : {'en': 'Enter a valid password', 'he': 'נא הזינו סיסמא תקינה'},
            'VALID_EMAIL' : {'en': 'Enter a valid email address', 'he': 'נא הזינו כתובת מייל תקינה'},
            'EMAIL_OR_PASSWORD_INCORRECT' : {'en' : 'Email or password is incorrect. If you are a first time user, please sign up.', 'he' : 'שגיאה בכתובת המייל או הסיסמא, אם את/ה משתמש/ת חדש/ה, נא הרשמ/י לאתר'},
            'FIRST_TIME_USER_ALERT' : {'en' : 'Are you a first time user? Please sign up.', 'he' : 'האם את/ה משתמש/ת חדשה באתר? נא הרשמ/י'},
           //texts
            'I_AM_A' : {'en': "I'm a ", 'he': 'אני '},
            'I_AM' : {'en': "I'm ", 'he': 'אני '},
            'SITTER' : {'en' : 'babysitter', 'he' : 'בייביסיטר'},
            'PARENT' : {'en' : 'parent', 'he' : 'הורה'},
            'I_AGREE_TO' : {'en' : 'I agree to the', 'he' : 'אני מסכימ/ה ל'},
            'TERMS' : {'en' : ' terms and conditions', 'he' : 'תנאי השימוש באתר'},

        //availability calendar
            'SUNDAY' : {'en' : 'Su', 'he' : "א'"},
            'MONDAY' : {'en' : 'Mo', "he" : "ב'"},
            'TUESDAY' : {'en' : 'Tu', "he" : "ג'"},
            'WEDNESDAY' : {'en' : 'We', "he" : "ד'"},
            "THURSDAY" : {'en' : "Th", "he" : "ה'"},
            "FRIDAY" : {'en' : "Fr", "he" : "ו'"},
            "SATURDAY" : {'en' : 'Sa', "he" : "שבת"},
            "AVAILABILITY_HEADER" : {'en' : 'When are you available?', 'he' : 'מתי את/ה פנוי/ה?'},
            "AVAILABILITY_HELP" : {'en' : 'You will receive email notifications for jobs according to your settings', 'he' : 'תקבל/י התראות למייל על משרות חדשות לפי ההעדפות שהגדרת'},
            "CALENDAR_VALID" : {'en' : 'My availability calendar is valid till : ', 'he' : 'לוח הזמנים שלי תקף עד לתאריך : '},

        //choose neighborhood/city
            "IN_JERUSALEM" : {'en' : 'In Jerusalem', 'he' : 'בירושלים'},
            "OUTSIDE_JERUSALEM" : {'en' : 'Outside of Jerusalem', 'he' : 'מחוץ לירושלים'},
            'HEADER_NEIGHBORHOODS' : {'en' : 'Choose neighborhoods you want to work in', 'he' : 'בחר/י את השכונות בהן תרצי לעבוד'},
            "VIEW_ON_MAP" : {'en' : 'View on a map', 'he' : 'תצוגה על מפה'},
            'HEADER_CITIES' : {'en' : 'Where outside Jerusalem do you want to work?', 'he' : 'איפה את/ה מעוניינ/ת לעבוד מחוץ לירושלים?'},

        //languages
            "PROFILE_CREATED" : {'en' : 'You successfully created your English profile', 'he' : "יצרת בהצלחה פרופיל בעברית"},
            "CREATE_PROFILE" : {'en' : "Create profile", 'he' : "יצירת פרופיל"},
            'IN' : {'en' : ' in ', 'he' : ' ב'},
            'LANGUAGE_ALERT_1' : {'en' : "Oh, you speak English!", 'he' : "את/ה מדבר/ת עברית? מעולה"},
            "LANGUAGE_ALERT_2" : {'en' : "Create a profile in English and reach more parents", 'he' : "צר/י פרופיל בעברית כדי להגיע ליותר הורים"},
            'LANGUAGE_ALERT_3' : {'en' : 'It will only take a few minutes', 'he' : 'זה יקח רק כמה דקות'},

         //Parent signup
            "PARENT_CONGRATS_HEADER1" : {'en' : 'Welcome to Popinz!', 'he' : 'ברוכים הבאים לפופינז!'},
            "PARENT_CONGRATS_HEADER2" : {'en' : 'Where finding a top notch, reliable and experienced babysitter in your neighborhood is a reality, even on short notice.',
                'he' : 'כאן תוכלו למצוא בייביסיטר אמינה ומנוסה בשכונה שלכם, אפילו בהתראה קצרה.'},
            "PARENT_CONGRATS_TEXT1" : {'en' : 'In order to guarantee the best service, we’ll only launch when we meet our target of 1,000 babysitters in Jerusalem. Now that you’ve signed up you’ll be the first to know, so stay tuned for updates!',
                'he' : 'על מנת להבטיח את השירות הטוב ביותר, לא נשיק עד שנגיע ל-1000 בייביסיטרים בירושלים והסביבה. עכשיו שנרשמתם - תהיו הראשונים לשמוע כשנצא לדרך, אז צפו לעדכונים.'},
            "PARENT_CONGRATS_TEXT2" : {'en' : 'In the meantime, you can visit', 'he' : 'בינתיים, אתם מוזמנים לבקר'},
            "PARENT_CONGRATS_TEXT3" : {'en' : '', 'he' : 'כדי לשמוע על פעילויות, טיולים והפעלות לכל המשפחה.'},
            "PARENT_CONGRATS_LINK1" : {'en' : 'our blog', 'he' : 'בבלוג שלנו'},
            "PARENT_CONGRATS_LINK2" : {'en' : 'Click here for more information on Popinz.', 'he' : 'לחצו כאן למידע נוסף על פופינז'},
        //Sitter profile
            "PROFILE_INCOMPLETE" : {'en' : 'This is your English profile. Please add the missing information in English to help English speaking parents get to know you', 'he' : 'זה הפרופיל שלך בעברית. נא מלאי את המידע החסר בעברית כדי לסייע להורים דוברי עברית להכיר אותך'},
            "ANOTHER_LANG_PROFILE" : {'en' : 'The profile you are viewing was written in another language, for your convenience we have translated some of the fields', 'he' : 'הפרופיל הזה נכתב בשפה אחרת, לנוחיותך תרגמנו חלקים ממנו'},
            "NAME_ALERT" : {'en' : 'Your name in English (click the pencil to update)', 'he' : 'השם שלך בעברית (לחצ/י על העיפרון כדי לערוך)'},
            "ABOUT_ME_ALERT" : {'en' : '"About me" in English - you may have completed this field in Hebrew, please complete it in English as well to help English speaking parents get to know you (click the pencil to update)', 'he' : 'ספר/י על עצמך בעברית - ייתכן שמילאת שדה זה באנגלית, נא מלא/י אותו גם בעברית כדי לסייע להורים דוברי עברית להכיר אותך (לחצ/י על העיפרון כדי לערוך)'},
            "EXPERIENCE_ALERT" : {'en' : 'Your experience in English - you may have completed this field in Hebrew, please complete it in English as well to help English speaking parents get to know you (click the pencil to update)', 'he' : 'פירוט על הניסיון שלך בעברית - ייתכן שמילאת שדה זה באנגלית, נא מלא/י אותו גם בעברית כדי לסייע להורים דוברי עברית להכיר אותך. (לחצ/י על העיפרון כדי לערוך)'},
            "FEMALE" : {'en' : 'Female', 'he' : 'בת'},
            "MALE" : {'en': 'Male', 'he' : 'בן'},
            "I_LIVE_IN" : {'en' : 'I live in ', 'he' : 'אני גר/ה ב'},
            "I_SPEAK" : {'en': 'I speak', 'he' : 'אני מדבר/ת'},
            "I_AM_LOOKING_FOR" : {'en' : 'I am looking for', 'he': 'אני מחפש/ת'},
            "MY_SKILLS_ARE" : {'en' : 'My main skills are', 'he' : 'הכישורים שלי'},
            "CONTACT_INFO_HEADER" : {'en' : 'Contact information', 'he' : 'פרטי התקשרות'},
            "CONTACT_INFO_HELP" : {'en' : 'Only you can see this', 'he': 'המידע הזה גלוי רק לך'},
            "ADDRESS" : {'en' : 'Address', 'he' : 'כתובת'},
            "ABOUT_ME_HEADER" : {'en' : 'More facts about me', 'he' : 'פרטים נוספים עליי'},
            "EXPERIENCE_TEXT_HEADER" : {'en' : 'My experience in babysitting', 'he' : 'הניסיון שלי'},
            "AREAS_HEADER" : {'en' : 'I work in the following areas', 'he' : 'אני עובד/ת'},
            "CALENDAR_HEADER" : {'en' : 'My availability calendar', 'he' : 'הזמינות השבועית שלי'},
            "VALID_TILL" : {'en' : 'valid until', 'he': 'בתוקף עד'},
            "OFFERINGS_HEADER" : {'en' : 'Offerings', 'he' : 'יכול/ה לעזור ב'},
            "EXPERIENCE_HEADER" : {'en' : 'Experience', 'he' : 'יש לי ניסיון ב'},
            "HOMEWORK_HELP_HEADER" : {'en' : 'Homework Help', 'he' : "עזרה בשיעורי הבית"},
            "CONGRATS_HEADER" : {'en' : 'Congratulations!', 'he' : 'הידד!'},
            "CONGRATS_TEXT1" : {'en' : 'You are a super hero!', 'he' : 'סחטיין עלייך,'},
            "CONGRATS_TEXT2" : {'en' : 'Your profile is complete!', 'he' : 'הפרופיל שלך מוכן!'},
            "CONGRATS_BTN" : {'en' : 'Hooray!', 'he' : 'יופי, תודה'},
            "CONTACT_SITTER_BTN" : {'en' : "Contact the sitter", 'he' : 'יצירת קשר'},
            "CHANGE_PHOTO_BTN" : {'en' : 'Change photo', 'he' : 'החלפת תמונה'},
            "CHANGE_PHOTO_HEADER" : {'en' : 'Edit photo', 'he' : 'עריכת תמונה'},

        //Browse sitters
            "BROWSE_SITTERS_HEADER1" : {'en' : 'Find babysitters in your neighborhood', 'he' : 'מצאו בייביסיטרים בשכונה שלכם'},
            "BROWSE_SITTERS_HEADER2" : {'en' : 'Search for babysitters who live in your neighborhood,', 'he' : 'חיפוש בייביסיטרים שגרים בשכונה שלכם'},
            "BROWSE_SITTERS_HEADER3" : {'en' : 'or search for babysitters who speak your language', 'he' : 'או בייבייסטרים שדוברים את השפה שלכם'},
            "LOCATION_FILTER_HEADER" : {'en' : 'Showing babysitters that live in', 'he' : 'מציג בייבייסטרים שגרים ב'},
            "LANG_FILTER_HEADER" : {'en' : 'Showing babysitters that speak', 'he' : ' מציג בייביסיטרים שמדברים'},
            "LOCATION_FILTER_HEADER_UNCHECKED" : {'en' : 'Search by neighborhood instead', 'he' : 'מעבר לחיפוש לפי שכונה'},
            "LANG_FILTER_HEADER_UNCHECKED" : {'en' : 'Search by language instead', 'he' : 'מעבר לחיפוש לפי שפה'},

            "LOCATION_POPUP_HEADER" : {'en' : 'Choose City and Neighborhood you live in', 'he' : 'אנא בחר/י את מקום המגורים שלך (עיר ושכונה)'},
            "ANY_LANGUAGE" : {'en' : 'Any language', 'he' : 'כל השפות'},
            "SEARCH" : {'en' : 'Search', 'he' : 'חיפוש'},
            "NO_RESULTS" : {'en' : 'Your search returned no results, try changing your criteria', 'he' : 'לא נמצאו תוצאות, נסו חיפוש אחר'},

        //Mini profile
            "READ_MORE" : {'en' : 'Read more', 'he': 'קרא/י עוד'},
            "READ_MORE_UNREG" : {'en' : 'Sign up to see full profile', 'he' : 'על מנת לצפות בפרופיל המלא יש להרשם לאתר'},

        //Parent profile
            "PARENT_PROFILE_HEADER1" : {'en' : 'Parent Dashboard - Coming soon', 'he' : 'פופינז הורים - בקרוב'},
            "WITH" : {"en" : "With", 'he' : 'עם'},
            "CHILD" : {"en" : 'child', 'he' : 'ילד'},
            "PLURAL" : {"en" : 'ren', "he" : 'ים'},
         //Page header
            "ABOUT" : {'en' : 'About', 'he' : 'אודות'},
            "BLOG" : {'en' : 'Blog', 'he' : 'בלוג'},
            "SIGN_UP" : {'en' : 'Sign up', 'he' : 'הרשמה'},
            "LOGIN" : {'en' : 'Login', 'he' : 'התחברות'},
            "LOGOUT" : {'en' : 'Logout', 'he' : 'התנתקות'},
            "CAMPS" : {'en' : 'Camps', 'he' : 'קייטנות'},
            "MY_PROFILE" : {'en' : 'My profile', 'he' : 'הפרופיל שלי'},
            "COMPLETE_IT" : {'en' : 'Complete your profile', 'he' : 'השלם/השלימי את הפרופיל שלך'},

        //Contact form
            "CONTACT_HEADER" : {'en' : 'Contact', 'he' : 'צר/י קשר עם'},
            "PHONE_NUMBER" : {'en' : 'phone number', 'he' : 'מספר טלפון'},
            "CONTACT_FORM_INFO_TEXT" : {'en' : 'will receive your details and will be able to contact you regarding future jobs', 'he' : 'יקבל את פרטייך ויוכל ליצור עמך קשר בנוגע לעבודה עבורך'},
            "CONTACT_ME_BY" : {'en' : 'Contact me by', 'he' : 'צרו איתי קשר באמצעות'},
            "ABOUT_US" : {'en' : 'About our family', 'he' : 'אודות המשפחה שלנו'},
            "REQUIREMENTS" : {'en' : 'We are looking for', 'he' : 'אנחנו מחפשים'},
            "KIDS_AGES" : {'en' : 'Kids ages', 'he' : 'גילאי ילדינו'},
            "NUMBER_OF_KIDS" : {'en' : "Number of kids", 'he' : "מספר הילדים שלך"},
            "CONTACT_METHOD_ALERT" : {'en' : 'Choose at least one contact method', 'he' : 'נא בחר/י דרך התקשרות אחת לפחות'},
            "DETAILS_SENT_TO_1" : {'en' : "We've sent your details to ", 'he' : 'שלחנו את הפרטים שלך ל'},
            "DETAILS_SENT_TO_2" : {'en' : ', who will contact you via the ', 'he' : ', שייצור/תיצור איתך קשר באמצעות '},
            "DETAILS_SENT_TO_3" : {'en' : ' you provided. Good luck!', 'he' : ' שרשמת. בהצלחה!'},
        
        //Frontpage
            //Slider 1: Hero
            'FRONTPAGE_TITLE1' : {'en': 'Calm Parents', 'he': 'הורים רגועים'},
            'FRONTPAGE_TITLE2' : {'en': 'Quality Babysitters', 'he': 'בייביסיטרים איכותיים'},
            'FRONTPAGE_TITLE3' : {'en': 'Happy Kids', 'he': 'ילדים שמחים'},
            'FRONTPAGE_SUBTITLE' : {'en': 'Flexible so you don’t have to be', 'he': 'גמישים כדי להתאים ללו"ז שלכם'},
            'JOIN' : {'en': 'Join now', 'he': 'להרשמה'},
            'BABYSITTERS' : {'en': 'Babysitters', 'he': 'בייביסטרים'},
            'PARENTS' : {'en': 'Parents', 'he': 'הורים'},
            
            //Slider 2: Map
            'FIND_BEST_OPTIONS_TITLE' : {'en': 'Find the best options in your neighborhood', 'he': 'מצאו את האפשרויות המתאימות ביותר בשכונה'},
            'FIND_BEST_OPTIONS_SUBTITLE' : {'en': 'Your next sitter could be down the street', 'he': 'הבייביסיטר הבאה שלכם ממש מעבר לפינה'},
            
            //Slider 3: Parent
            'PARENTS_TITLE' : {'en' : 'ensure your children are in the best possible hands', 'he' : 'זה הפתרון המושלם עבורכם'},
            'POST_A_JOB' : {'en': 'Post Your Job', 'he': 'פרסמו משרה'},
            'POST_A_JOB_SUBTITLE1' : {'en': 'We’ll send out notifications', 'he': 'ואנחנו נשלח התראות'},
            'POST_A_JOB_SUBTITLE2' : {'en': 'to relevant babysitters', 'he': 'לבייביסיטרים המתאימים'},
            'FIND_BABYSITTERS' : {'en': 'Find a Babysitter', 'he': 'מצאו בייביסיטר'},
            'FIND_BABYSITTERS_SUBTITLE1' : {'en': 'Take your pick of the', 'he': 'בחרו מבין הבייביסיטרים'},
            'FIND_BABYSITTERS_SUBTITLE2' : {'en': 'best available babysitters', 'he': 'הפנוים הטובים ביותר'},

            'HAVE_A_BLAST' : {'en': 'Have a Blast', 'he': 'צאו לבלות'},
            'HAVE_A_BLAST_SUBTITLE1' : {'en': 'Knowing your kids are', 'he': 'דעו שהילדים שלכם'},
            'HAVE_A_BLAST_SUBTITLE2' : {'en': 'in the best possible hands', 'he': 'בידיים טובות'},

            //Slider 4: Babysitter
            'BABYSITTERS_TITLE' : {'en' : 'finding work just became easy', 'he' : 'העבודה הבאה שלכם כבר פה'},
            'CREATE_PROFILE' : {'en': 'Create Your Profile', 'he': "צרו פרופיל"},
            'CREATE_PROFILE_SUBTITLE1' : {'en': 'Showcase your personality and', 'he': 'הציגו את כישוריכם ואת הייחודיות'},
            'CREATE_PROFILE_SUBTITLE2' : {'en': 'skills to your next employers', 'he': 'שלכם להורים שמחפשים אתכם'},
            'CHOOSE_JOBS' : {'en': 'Choose Jobs', 'he': 'בחרו משרה'},
            'CHOOSE_JOBS_SUBTITLE1' : {'en': 'Receive customized notifications', 'he': 'קבלו התראות מותאמות אישית על'},
            'CHOOSE_JOBS_SUBTITLE2' : {'en': 'about new jobs that work for you', 'he': 'משרות שמתאימות לכם בול'},
            'GET_WORKING' : {'en': 'Get Working', 'he': 'יאללה לעבודה'},
            'GET_WORKING_SUBTITLE1' : {'en': 'From one-time gigs to long-term', 'he': 'החל מעבודה חד-פעמית ועד עבודה במשרה'},
            'GET_WORKING_SUBTITLE2' : {'en': ' work, find that job you want', 'he': 'מלאה, מצאו את המשרה שחיפשתם'},

            //Slider 5 - parents + babysitters with illustrations
            "ILLUSTRATIONS_SITTERS_SUBTITLE1" : {'en' : 'We know you have so much to offer', 'he' : 'אנחנו יודעים שאתם אמינים ונהדרים'},
            "ILLUSTRATIONS_SITTERS_SUBTITLE2" : {'en' : "And can't wait to see how great you are", 'he' : 'עם ילדים, '},
            "ILLUSTRATIONS_SITTERS_SUBTITLE3" : {'en' : 'Sign up and we’ll get to know each other :)', 'he' : 'הרשמו ונכיר אחד את השני :)'},
            "FIND_A_JOB" : {'en' : 'Find me a job', 'he' : 'מצאו לי עבודה'},
            "ILLUSTRATIONS_PARENTS_SUBTITLE1" : {'en' : "Although, there's nothing like parents,", 'he' : 'תמיד תדעו שהאוצרות הקטנים שלכם'},
            "ILLUSTRATIONS_PARENTS_SUBTITLE2" : {'en' : "at Popinz we come pretty close", 'he' : 'בידיים בטוחות'},
            "ILLUSTRATIONS_PARENTS_SUBTITLE3" : {'en' : 'Your kids are in the best possible hands :)', 'he' : 'אנחנו תמיד פה בשבילכם :)'},
            "FIND_A_SITTER" : {'en' : 'Find me a babysitter', 'he' : 'מצאו לי בייביסיטר'},
            "OUR_PARTNERS" : {'en' : 'Our partners', 'he' : 'שותפים שלנו'},
            "LINK_TO_TERMS" : {'en' : 'Use of this site signifies your acceptance of the ', 'he' : 'השימוש באתר בהתאם ל'},
            "FOOTER_TERMS_OF_SERVICE" : {'en' : 'Popinz Terms of Service', 'he' : 'תנאי השימוש'}
        }
        
        var translateService = {};

        translateService.getEnumName = function(obj, lang){
            if(obj)
            {
                if(lang === 'en' || (lang === undefined && $rootScope.lang === 'en'))
                    return obj.englishName;
                else if(lang === 'he' || (lang === undefined && $rootScope.lang === 'he'))
                    return obj.hebrewName;
            }
        };

        translateService.getBestName = function(person, lastName){
            var miniName = 'No name';
            if(($rootScope.lang === 'en' && person.firstNameEn)||
                ($rootScope.lang === 'he' && !person.firstNameHe)){
                    miniName = person.firstNameEn;
                    if(lastName && person.lastNameEn)
                        miniName = miniName + " " + person.lastNameEn[0];
            }
            else if(person.firstNameHe)
                miniName = person.firstNameHe;
                if(lastName && person.lastNameHe)
                    miniName = miniName + " " + person.lastNameHe[0];
            return miniName;
        }

        translateService.getDir = function(person){
            if(($rootScope.lang === 'en' && person.firstNameEn) || ($rootScope.lang === 'he' && !person.firstNameHe))
                return "ltr";
            else
                return "rtl";
        }

        translateService.getTranslation = function(key, lang){
            if(key && key!=="")
            {
                var txt = texts[key];
                if(txt)
                {
                    if(!lang)
                        return txt[$rootScope.lang];
                    else
                        return txt[lang];
                }
                else
                  return "";
            }
            else
                return "";
        };
        return translateService;
    }]);

    translate.filter('translate', ["translateService", function(translateService) {
      return function(input, lang) {
        input = input || '';
        var out = translateService.getTranslation(input, lang);
        return out;
      };
    }]);

    translate.filter('translateRe', ["translateService", function(translateService) {
      return function(input, txt) {
        input = input || 'he';
        var out = translateService.getTranslation(txt, input);
        return out;
      };
    }]);

})();