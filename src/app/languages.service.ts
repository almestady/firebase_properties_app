import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class Labels {
  constructor(
    public id: string,                                          // 1
    public title: string,                                       // 2
    public type: string,                                        // 3
    public userId: string,                                      // 4
    public description: string,                                 // 5
    public personalPic: string,                                 // 6
    public price: string,                                       // 7
    public address: string,                                 // 8
    public space: string,                                 // 9
    public bedrooms: string,                                 // 10
    public bathrooms: string,                                 // 11
    public ketchins: string,                                 // 12
    public livingrooms: string,                                 // 13
    public garages: string,                                 // 14
    public gardens: string,                                 // 15
    public startDate: string,                                 // 16
    public endDate: string,                                 // 17
    public views: string,                                 // 18
    public firstName: string,                                 // 19
    public lastName: string,                                 // 20
    public birthday: string,                                 // 21
    public email: string,                                 // 22
    public password: string,                                 // 23
    public gender: string,                                 // 24
    public country: string,                                 // 25
    public city: string,                                 // 26
    public area: string,                                 // 27
    public zipcode: string,                                 // 28
    public phone: string,                                 // 29
    public imageUrl: string,                                 // 30
    public errorFirstname: string,                                 // 31
    public errorPhone: string,                                 // 32
    public errorAddress: string,                                 // 33
    public errorZipcode: string,                                 // 34
    public errorArea: string,                                 // 35
    public errorCity: string,                                 // 36
    public errorCountry: string,                                 // 37
    public errorBirthday: string,                                 // 38
    public errorGender: string,                                 // 39
    public errorPasswrod: string,                                 // 40
    public errorEamil: string,                                 // 41
    public errorLastname: string,                                 // 42
    public errorTitle: string,                                 // 43
    public errorDescription: string,                                 // 44
    public errorPrice: string,                                 // 45
    public errorType: string,                                 // 46
    public errorSpace: string,                                 // 47
    public errorOwner: string,                                 // 48
    public errorBedrooms: string,                                 // 49
    public errorBathrooms: string,                                 // 50
    public errorKetchins: string,                                 // 51
    public errorLivingrooms: string,                                 // 52
    public errorGardens: string,                                 // 53
    public errorGarages: string,                                 // 54
    public errorStartDate: string,                                 // 55
    public errorEndDate: string,                                 // 56
    public newproperty: string,                                 // 57
    public propertyName: string,                                 // 58
    public errorpropertyName: string,                                 // 59
    public propertyPicture: string,                                 // 60
    public errorpropertyPicture: string,                                 // 61
    public propertySampleView: string,                                 // 62
    public previous: string,                                 // 63
    public next: string,                                 // 64
    public display: string,                                 // 65
    public property: string,                                 // 66
    public offerPrice: string,                                 // 67
    public originalPrice: string,                                 // 68
    public newOffer: string,                                 // 69
    public propertiesManagment: string,                                 // 70
    public listOfOffers: string,                                 // 71
    public listOfProperties: string,                                 // 72
    public reservation: string,                                 // 73
    public bookedBy: string,                                 // 74
    public discoverOffers: string,                                 // 75
    public modivication: string,                                 // 76
    public show: string,                                 // 77
    public rent: string,                                 // 78
    public forSale: string,                                 // 79
    public search: string,                                 // 80
    public request: string,                                 // 81
    public newCustomerWelcome: string,                                 // 82
    public mr: string,                                 // 83
    public mrs: string,                                 // 84
    public miss: string,                                 // 85
    public confirmPassword: string,                                 // 86
    public male: string,                                 // 87
    public female: string,                                 // 88
    public errorUserId: string,                                 // 89
    public errorConfirmPasswrod: string,                                 // 90
    public exit: string,                                 // 91
    public modifiy: string,                                 // 92
    public createAccount: string,                                 // 93
    public book: string,                                 // 94
    public offersAndRequests: string,                                 // 95
    public owner: string,                                 // 96
    public likes: string,                                 // 97
    public cancel: string,
    public welcome: string,                            // 98
    public sure: string,                               // 99
    public chooseBookingDate: string,               //100
    public ok: string,               //101
    public cancelBookingQuest: string,     // 102
    public nothingTodisplay: string,     // 103
    public pickLocation: string,        // 104
    public pickImage: string           //105
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {
  private _arabicLabels = new BehaviorSubject<Labels>(
    new Labels(
      'رقم المنتج',                                          // 1
      'اللقب',                                       // 2
      'النوع',                                        // 3
      'معرف العميل',                                      // 4
      'الوصف',                                 // 5
      'الصورة الشخصية',                                 // 6
      'السعر',                                       // 7
      'عنوان',                                 // 8
      'المساحة',                                 // 9
      'غرفة النوم',                                 // 10
      'دورة المياه',                                 // 11
      'مطبخ',                                 // 12
      'غرفة معيشة',                                 // 13
      'حديقة',                                 // 14
      'موقف',                                 // 15
      'من ',                                 // 16
      'حتى ',                                 // 17
      'مشاهدات',                                 // 18
      'الإسم',                                 // 19
      'العائلة',                                 // 20
      'تاريخ الميلاد',                                 // 21
      'البريد الإلكتروني',                                 // 22
      'الرقم السري',                                 // 23
      'الجنس',                                 // 24
      'الدولة',                                 // 25
      'المدينة',                                 // 26
      'المنطقة',                                 // 27
      'الرمزالبريدي',                                 // 28
      'الهاتف',                                 // 29
      'رابط الصورة',                                 // 30
      'الرجاء إدخال الإسم الأول',                                 // 31
      'الرجاء إدخال رقم الهاتف',                                 // 32
      'الرجاء إدخال العنوان',                                 // 33
      'الرجاء إدخال الرمز البريدي',                                 // 34
      'الرجاء إختيار المنطقة',                                 // 35
      'الرجاء إختيار المدينة',                                 // 36
      'الرجاء إختيار الدولة',                                 // 37
      'الرجاء إختيار تاريخ الميلاد',                                 // 38
      'الرجاء تحديد الجنس',                                 // 39
      'الرجاء إدخال الرمز السري',                                 // 40
      'الرجاء إدخال البريد الإلكتروني',                                 // 41
      'الرجاء إدخال إسم العائلة',                                 // 42
      'حدد اللقب',                                 // 43
      'الرجاء إدخال الوصف',                                 // 44
      'الرجاء إدخال السعر',                                 // 45
      'الرجاء إدخال النوع',                                 // 46
      'الرجاء إدخال المساحة',                                 // 47
      'الرجاء إدخال إسم المالك',                                 // 48
      'الرجاء إدخال عدد غرف النوم',                                 // 49
      'الرجاء إدخال عدد دورات المياه',                                 // 50
      'الرجاء إدخال عدد المطابخ',                                 // 51
      'الرجاء إدخال عدد غرف المعيشة',                                 // 52
      'الرجاء إدخال عدد الحدائق',                                 // 53
      'الرجاء إدخال عدد المواقف',                                 // 54
      'الرجاء إدخال تاريخ البداية',                                 // 55
      'الرجاء إدخال تاريخ النهاية',                                 // 56
      'منتج جديد',                                 // 57
      'إسم المنتج',                                 // 58
      'الرجاء إدخال إسم المنتج',                                 // 59
      'صورة المنتج',                                 // 60
      'الرجاء إضافة صورة المنتج',                                  // 61
      'نموذج المنتج',                                 // 62
      'السابق',                                 // 63
      'التالي',                                 // 64
      'المعرض',                                 // 65
      'أملاك',                                 // 66
      'سعر العرض',                                 // 67
      'السعر الأصلي',                                 // 68
      'عرض جديد',                                 // 69
      'إدارة أملاك',                                 // 70
      'لايوجد لديك  معروضات',                                 // 71
      'لايوجد لديك أملاك',                                 // 72
      'الحجوزات',                                 // 73
      'تم الحجز لـ',                                 // 74
      'إكتشف العروض',                                 // 75
      'تعديل',                                 // 76
      'إعرض',                                      // 77
      'إيجار',                                 // 78
      'للبيع',                                 // 79
      'بحث',                                 // 80
      'طلب',                                 // 81
      'مرحبا بك عميل جديد',                                 // 82
      'السيد',                                 // 83
      'السيدة',                                 // 84
      'الآنسة',                                 // 85
      'تأكيد الرمز السري',                                 // 86
      'ذكر',                                 // 87
      'أنثى',                                 // 88
      'الرجاء إختيار إسم مستخدم',                                 // 89
      'الرجاء إعادة إدخال إسم المستخدم',                                 // 90
      'خروج',                                 // 91
      'تعديل',                                 // 92
      ' أنشأ الحساب',                                 // 93
      'حجز',                                 // 94
      'عرض وطلب',                                 // 95
      'المالك',                                 // 96
      'إعجاب',                                 // 97,
      'إلغاء',
      'مرحبا بك',                            // 98
      'تأكيد',                                 //99
      'الرجاء إختيار الحجز ',             // 100
      'موافق',                             // 101
      'هل تريد إلغاء الموعد',             // 102
      ' عذرا، لايوجد معروضات ',   //103
      'حدد موقعك على الخارطة',        // 104
      'إلتقط صورة'                             //105
    )
  );

  constructor() { }
  get arabicLabel() {
    return this._arabicLabels.asObservable();
  }
}
