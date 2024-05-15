


export const TYPE_OPTIONS = [
    {
      group: 'Audio',
      classify: [
        { id: 1, name: 'Audiometry',icon:'lucide:file-audio'},
        { id: 2, name: 'Auscultation (any organ)',icon:'lucide:file-audio' },
        { id: 3, name: 'Tympanometry',icon:'lucide:file-audio' },
        { id: 4, name: 'Audio - Others',icon:'lucide:file-audio'}
      ],
      
    },
    { group: 'Biopsy', classify: [
        { id: 5, name: 'Biopsy', icon:'ph:syringe-fill'},
        { id: 6, name: 'Biopsy - Others' , icon:'ph:syringe-fill'}
    ] },
    { group: 'Blood Tests', classify: [
        { id: 7, name: 'Blood Tests', icon:'fontisto:blood' },
        { id: 8, name: 'Blood Test - Others' , icon:'fontisto:blood'}
    ] },
    {
      group: 'Gastroenterology/Hepatology',
      classify: [
        { id: 9, name: 'Liver Fibroscan' , icon:'healthicons:liver-alt'},
        { id: 10, name: 'Liver Shearwave Elastography' , icon:'healthicons:liver-alt'},
        { id: 11, name: 'Gastroenterology - Others' , icon:'game-icons:stomach'}
      ],
    },
    {
      group: 'Heart Station',
      classify: [
        { id: 12, name: 'Cardiac Catheterization', icon:'material-symbols:ecg-heart-sharp' },
        { id: 13, name: 'Echocardiography' , icon:'tabler:device-heart-monitor-filled'},
        { id: 14, name: 'Echocardiography w/ Doppler' , icon:'tabler:device-heart-monitor-filled'},
        { id: 15, name: 'Electrocardiography (ECG)' , icon:'tabler:device-heart-monitor-filled'},
        { id: 16, name: 'Holter Monitoring' , icon:'tabler:heart-rate-monitor'},
        { id: 17, name: 'Impedance Cardiography (ICG)' , icon:'tabler:device-heart-monitor-filled'},
        { id: 18, name: 'Stress Echocardiography' , icon:'tabler:device-heart-monitor-filled'},
        { id: 19, name: 'Treadmill Exercise Test' , icon:'tabler:treadmill'},
        { id: 20, name: 'Treadmill Stress Echo' , icon:'tabler:treadmill'},
        { id: 21, name: 'Treadmill Stress Test' , icon:'tabler:treadmill'},
        { id: 22, name: 'Heart Station - Others' , icon:'tabler:device-heart-monitor-filled'}
      ],
    },
    {
        group: 'Imaging',
        classify: [
          { id: 23, name: 'Angiography (Angiogram)' , icon:'ion:body'},
          { id: 24, name: 'CT Scan (Computed Tomography)' , icon:'openmoji:ct-scan'},
          { id: 25, name: 'DXA (Bone Densitometry)' , icon:'solar:bone-bold'},
          { id: 26, name: 'Fluoroscopy' , icon:'ri:body-scan-fill'},
          { id: 27, name: 'General Ultrasonography (Ultrasound)' , icon:'medical-icon:ultrasound'},
          { id: 28, name: 'MRI (Magnetic Resonance Imaging)' , icon:'medical-icon:i-mri-pet'},
          { id: 29, name: 'Mammography' , icon:'medical-icon:i-mammography'},
          { id: 30, name: 'Musculoskeletal Ultrasound (MSK)' , icon:'icon-park-solid:muscle'},
          { id: 31, name: 'PET Scan (Positron Emission Tomography)' , icon:'medical-icon:i-mri-pet'},
          { id: 32, name: 'Radioisotope Scanning' , icon:'ion:radio-sharp'},
          { id: 33, name: 'Radionuclide Imaging' , icon:'medical-icon:i-mri-pet'},
          { id: 34, name: 'Special Ultrasound w/ color flow' , icon:'medical-icon:ultrasound'},
          { id: 35, name: 'Thyroid Scan', icon:'ion:body' },
          { id: 36, name: 'X-ray' , icon:'la:x-ray'},
          { id: 37, name: 'Imaging - Others' , icon:'la:x-ray'},
        ],
    },
    {
        group: 'Mens Health',
        classify: [
          { id: 38, name: 'Acrosome Reaction' , icon:'healthicons:sperm-negative'},
          { id: 39, name: 'Hemizona Assay' , icon:'healthicons:sperm-negative'},
          { id: 40, name: 'Hypo-osmotic Swelling' , icon:'healthicons:sperm-negative'},
          { id: 41, name: 'Scrotal Ultrasound', icon:'fa-solid:male' },
          { id: 42, name: 'Semen Analysis' , icon:'healthicons:sperm-negative'},
          { id: 43, name: 'Sperm Agglutination' , icon:'healthicons:sperm-negative'},
          { id: 44, name: 'Sperm Penetration Assay' , icon:'healthicons:sperm-negative'},
          { id: 45, name: 'Testicular Biopsy' , icon:'fa-solid:male'},
          { id: 46, name: 'Ultrasonography' , icon:'medical-icon:ultrasound'},
          { id: 47, name: 'Urinalysis' , icon:'fe:tumbler-glass'},
          { id: 48, name: 'Vasography' , icon:'fa-solid:male'},
          { id: 49, name: 'Mens Health - Others' , icon:'fa-solid:male'},
        ],
    },
    {
        group: 'Nephrology',
        classify: [
          { id: 50, name: 'Dialysis' , icon:'bi:lungs-fill'},
          { id: 51, name: 'Nephrology - Others' , icon:'bi:lungs-fill'},
        ],
    },
    {
        group: 'Neurology',
        classify: [
          { id: 52, name: 'Videonystagmography' , icon:'medical-icon:neurology'},
          { id: 53, name: 'Neurology - Others' , icon:'medical-icon:neurology'},
        ],
    },
    {
        group: 'Neuromuscular Testing',
        classify: [
          { id: 54, name: 'Electroencephalography (EEG)' , icon:'mingcute:head-fill'},
          { id: 55, name: 'Electromyography (EMG)' , icon:'ic:twotone-monitor-heart'},
          { id: 56, name: 'Electrophysiologic Testing (EPS)' , icon:'icon-park:heart-rate'},
          { id: 57, name: 'Nerve conduction Study (NCS)' , icon:'healthicons:nerve-negative'},
          { id: 58, name: 'Reflex Test' , icon:'solar:bone-crack-bold-duotone'},
          { id: 59, name: 'Neuromuscular Testing - Others' , icon:'ic:twotone-monitor-heart'},
        ],
    },
    {
        group: 'Oncology',
        classify: [
          { id: 60, name: 'Chemotherapy' , icon:'medical-icon:oncology'},
          { id: 61, name: 'Oncology - Others' , icon:'medical-icon:oncology'},
        ],
    },
    {
        group: 'Ophthalmology',
        classify: [
          { id: 62, name: 'B-Scan Ultrasonography' , icon:'fa6-solid:eye'},
          { id: 63, name: 'Biometry' , icon:'fa6-solid:eye'},
          { id: 64, name: 'Corneal Pachymetry' , icon:'fa6-solid:eye'},
          { id: 65, name: 'Corneal Topography' , icon:'fa6-solid:eye'},
          { id: 66, name: 'Fluorescein Angiography (FA)' , icon:'fa6-solid:eye'},
          { id: 67, name: 'Frequency Doubling Technology (FDT) Perimetry' , icon:'fa6-solid:eye'},
          { id: 68, name: 'Fundus Photography' , icon:'fa6-solid:eye'},
          { id: 69, name: 'Gonioscopy' , icon:'fa6-solid:eye'},
          { id: 70, name: 'Indocyanine Green (ICG) Retina Tomography' , icon:'fa6-solid:eye'},
          { id: 71, name: 'Indocyanine Green (ICG) Retina Tomography w/ Fluorescein Angiography (FA)' , icon:'fa6-solid:eye'},
          { id: 72, name: 'Optical Coherence Tomography (OCT) Optos Wide-Field Angiography' , icon:'fa6-solid:eye'},
          { id: 73, name: 'Optos Wide-Field Fundus Photos' , icon:'fa6-solid:eye'},
          { id: 74, name: 'Pentacam' , icon:'fa6-solid:eye'},
          { id: 75, name: 'Perimetry / Visual Field Test' , icon:'fa6-solid:eye'},
          { id: 76, name: 'Retcam' , icon:'fa6-solid:eye'},
          { id: 77, name: 'Slit Lamp Findings' , icon:'fa6-solid:eye'},
          { id: 78, name: 'Tonometry - Applanation' , icon:'fa6-solid:eye'},
          { id: 79, name: 'Tonometry - Indentation' , icon:'fa6-solid:eye'},
          { id: 80, name: 'Ultrasonography (UTZ)' , icon:'fa6-solid:eye'},
          { id: 81, name: 'Ultrasound Biomicroscopy (UBM)' , icon:'fa6-solid:eye'},
          { id: 82, name: 'Ophthalmology - Others' , icon:'fa6-solid:eye'},
        ],
    },
    {
        group: 'Organ Visualization (Endoscopy)',
        classify: [
          { id: 83, name: 'Arthroscopy (Joints)' , icon:'solar:bone-bold'},
          { id: 84, name: 'Bronchoscopy (Lungs)' , icon:'bi:lungs-fill'},
          { id: 85, name: 'Colonoscopy (Colon)', icon:'healthicons:intestinal-pain-negative' },
          { id: 86, name: 'Cystoscopy (Bladder)' , icon:'healthicons:gallbladder-negative' },
          { id: 87, name: 'Esophagoscopy (Esophagus)' , icon:'game-icons:antibody'},
          { id: 88, name: 'Gastroscopy (Stomach)' , icon:'healthicons:stomach-negative'},
          { id: 89, name: 'Hysteroscopy (Uterus)' , icon:'icon-park-outline:uterus'},
          { id: 90, name: 'Laparoscopy (Abdominal Cavity)' , icon:'icon-park:abdominal'},
          { id: 91, name: 'Laryngoscopy (Voice Box)' , icon:'bx:user-voice'},
          { id: 92, name: 'Mediastinoscopy (Chest Area)', icon:'game-icons:chest-armor' },
          { id: 93, name: 'Proctosigmoidoscopy (Lower Colon)' , icon:'healthicons:intestinal-pain-negative'},
          { id: 94, name: 'Thoracoscopy (Lungs & Pleura)', icon:'bi:lungs-fill' },
          { id: 95, name: 'Upper Gastrointestinal Endoscopy (Esophagus, Stomach, Small Intestine)' , icon:'healthicons:stomach-negative'},
          { id: 96, name: 'Ureteroscopy (Urethra)' , icon:'icon-park-outline:uterus'},
          { id: 97, name: 'Organ Visualization' , icon:'solar:bone-bold'},
        ],
    },
    {
        group: 'Other Body Fluids',
        classify: [
          { id: 98, name: 'Amniocentesis (Amniotic Fluid Test / AFT)', icon:'material-symbols:fluid-med' },
          { id: 99, name: 'Bacterial Culture' , icon:'material-symbols:fluid-med'},
          { id: 100, name: 'Bone Marrow Aspiration' , icon:'material-symbols:fluid-med'},
          { id: 101, name: 'Chrionic villus Sampling (CVS)' , icon:'material-symbols:fluid-med'},
          { id: 102, name: 'Fluids and Electrolytes Test' , icon:'material-symbols:fluid-med'},
          { id: 103, name: 'Joint Aspiration' , icon:'material-symbols:fluid-med'},
          { id: 104, name: 'Paracentesis' , icon:'material-symbols:fluid-med'},
          { id: 105, name: 'Spinal Tap (Lumbar Puncture)' , icon:'material-symbols:fluid-med'},
          { id: 106, name: 'Sputum Exam' , icon:'material-symbols:fluid-med'},
          { id: 107, name: 'Thoracentesis' , icon:'material-symbols:fluid-med'},
          { id: 108, name: 'Other Body Fluids - Others' , icon:'material-symbols:fluid-med'},
        ],
    },
    {
        group: 'Stool Exam',
        classify: [
          { id: 109, name: 'Stool Exam' , icon:'fe:tumbler-glass'},
          { id: 110, name: 'stool Others' , icon:'fe:tumbler-glass'},
        ],
    },
    {
        group: 'Urine Exam',
        classify: [
          { id: 111, name: 'Urine Exam' , icon:'fe:tumbler-glass'},
          { id: 112, name: 'urine - Others' , icon:'fe:tumbler-glass'},
        ],
    },
    {
        group: 'Vascular Study',
        classify: [
          { id: 113, name: 'Arterial Duplex Scan' , icon:'healthicons:nerve'},
          { id: 114, name: 'Carotid Duplex Scan' , icon:'healthicons:nerve'},
          { id: 115, name: 'Venous Duplex Scan' , icon:'healthicons:nerve'},
          { id: 116, name: 'Vascular Study - Others' , icon:'healthicons:nerve'},
        ],
    },
    {
        group: 'Womens Health Tests',
        classify: [
          { id: 117, name: 'Biophysical Profile' , icon:'medical-icon:i-womens-health'},
          { id: 118, name: 'Breast Ultrasound' , icon:'medical-icon:i-womens-health'},
          { id: 119, name: 'Cardiotocography (CTG/Electronic Fetal Monitor)' , icon:'medical-icon:i-womens-health'},
          { id: 120, name: 'Congenital Anomaly Scan' , icon:'medical-icon:i-womens-health'},
          { id: 121, name: 'Dilatation and Curettage (D&C)' , icon:'medical-icon:i-womens-health'},
          { id: 122, name: 'Doppler Velocimetry Studies' , icon:'medical-icon:i-womens-health'},
          { id: 123, name: 'Electronic Fetal Monitoring' , icon:'medical-icon:i-womens-health'},
          { id: 124, name: 'Fetal Biometry' , icon:'medical-icon:i-womens-health'},
          { id: 125, name: 'First Trimester Ultrasound' , icon:'medical-icon:i-womens-health'},
          { id: 126, name: 'Gynecologic', icon:'medical-icon:i-womens-health'},  
          { id: 127, name: 'Obstetric' , icon:'medical-icon:i-womens-health'},
          { id: 128, name: 'Pap Smear (Papanicolaou Smear Test)' , icon:'medical-icon:i-womens-health'},
          { id: 129, name: 'Pelvic Ultrasound' , icon:'medical-icon:i-womens-health'},
          { id: 130, name: 'Pregnancy Test' , icon:'medical-icon:i-womens-health'},
          { id: 131, name: 'Transvaginal/Transrectal Ultrasound' , icon:'medical-icon:i-womens-health'},  
        ],
    },
];
