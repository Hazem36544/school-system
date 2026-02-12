export const studentsData = [
    {
        id: '1',
        name: 'محمد أحمد العلي',
        grade: 'الصف الثالث الابتدائي',
        classNum: '3',
        level: 'المرحلة الابتدائية',
        age: 9,
        parent: 'أحمد العلي',
        caseNumber: 'CASE-12453',
        status: 'ممتاز',
        attendanceRate: '95%',
        lastReportDate: '15 يناير 2026',
        reports: [
            {
                id: 101,
                title: 'تقرير شهر مارس',
                school: 'مدرسة الأمير فيصل الابتدائية',
                date: '28 مارس 2026',
                status: 'تم المراجعة',
                summary: { attendance: '100%', performance: 'ممتاز', behavior: 'ممتاز', note: 'تحسن ملحوظ في المشاركة الصفية والتفاعل مع الزملاء' },
                detailedReport: {
                    attendance: { totalDays: 22, attendedDays: 22, percentage: '100%', note: 'حضور منتظم دون أي غياب.' },
                    academic: { overallRating: 'ممتاز', note: 'أداء استثنائي.', subjects: [] },
                    behavior: { overallRating: 'ممتاز', note: 'الطالب مثال يحتذى به.' }
                }
            }
        ]
    },
    {
        id: '2',
        name: 'علي حسن المصري',
        grade: 'الصف الخامس الابتدائي',
        classNum: '5',
        level: 'المرحلة الابتدائية',
        age: 11,
        parent: 'حسن المصري',
        caseNumber: 'CASE-12387',
        status: 'جيد جداً',
        attendanceRate: '88%',
        lastReportDate: '10 يناير 2026',
        reports: []
    },
    {
        id: '3',
        name: 'خالد عمر السيد',
        grade: 'الصف الثاني الابتدائي',
        classNum: '2',
        level: 'المرحلة الابتدائية',
        age: 8,
        parent: 'عمر السيد',
        caseNumber: 'CASE-12511',
        status: 'جيد',
        attendanceRate: '92%',
        lastReportDate: '12 يناير 2026',
        reports: []
    },
    {
        id: '4',
        name: 'سارة محمد عبدالله',
        grade: 'الصف الرابع الابتدائي',
        classNum: '4',
        level: 'المرحلة الابتدائية',
        age: 10,
        parent: 'محمد عبدالله',
        caseNumber: 'CASE-12622',
        status: 'ممتاز',
        attendanceRate: '98%',
        lastReportDate: '20 يناير 2026',
        reports: []
    }
];
