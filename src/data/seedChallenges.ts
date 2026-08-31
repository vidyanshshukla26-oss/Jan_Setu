import { Challenge } from '../types';

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'CH-26043-001',
    title: 'Fluoride & Arsenic Contamination in Rural Groundwater Filtration Units',
    category: 'Water & Sanitation',
    sdgNumber: 6,
    sdgName: 'Clean Water and Sanitation',
    description:
      'High concentrations of geogenic fluoride (>2.8 mg/L) and toxic arsenic in 14 village handpumps in the Nalgonda & Ballia belt cause severe dental/skeletal fluorosis among children. Existing RO plants reject 60% water and face heavy membrane fouling due to high salinity.',
    impactedPopulation: 34200,
    location: {
      city: 'Ballia',
      state: 'Uttar Pradesh',
      country: 'India',
      latitude: 25.7600,
      longitude: 84.1500,
      address: 'Bairia Block, Ballia District',
      pincode: '277201'
    },
    severity: 'Critical',
    severityScore: 94,
    status: 'open_for_solutions',
    reportedBy: {
      name: 'Dr. Rameshwar Pandey',
      role: 'citizen',
      organization: 'Gram Vikas Panchayat Committee'
    },
    reportedDate: '2026-08-14',
    upvotes: 482,
    bountyAmount: 750000,
    sponsors: [
      {
        id: 'sp-1',
        name: 'Jal Jeevan Innovation Mission',
        type: 'Government',
        amount: 500000
      },
      {
        id: 'sp-2',
        name: 'Tata Water Technologies Fund',
        type: 'CSR Foundation',
        amount: 250000
      }
    ],
    evidenceImages: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80'
    ],
    primaryTechDisciplines: [
      'Chemical Engineering',
      'Nanotechnology',
      'Solar-Powered IoT Sensors',
      'Material Science'
    ],
    aiAnalysis: {
      summary:
        'Urgent need for low-cost, zero-electricity or solar-assisted nano-adsorbent filtration that achieves <0.5 mg/L fluoride without brine effluent waste.',
      rootCauses: [
        'Geological bedrock mineral leaching into aquifers',
        'Over-extraction of groundwater shifting extraction to deeper fluoride-rich strata',
        'Lack of affordable domestic and community-scale adsorbent regeneration'
      ],
      suggestedApproaches: [
        'Activated biochar infused with aluminium/zirconium nano-oxides',
        'Gravity-fed electrocoagulation powered by localized 50W solar panels',
        'IoT colorimetric water quality beacon sending alerts to Panchayat dashboard'
      ],
      potentialRisks: [
        'Safe disposal of spent adsorbent sludge',
        'Community adoption requiring zero recurring chemical purchases'
      ],
      estimatedTimelineMonths: 6,
      recommendedTRLTarget: 7
    },
    solutionsCount: 3,
    solutions: [
      {
        id: 'SOL-101',
        challengeId: 'CH-26043-001',
        title: 'Nano-Alumina Biochar Cartridge with Zero Wastewater Reject',
        teamName: 'AquaShield Innovators (IIT Kanpur)',
        teamLead: {
          name: 'Ananya Deshmukh',
          email: 'ananya.d@iitk.ac.in',
          organizationOrCollege: 'IIT Kanpur'
        },
        abstract:
          'A modular gravity-driven filter using agricultural waste biochar coated with nano-crystalline aluminum hydroxide. Reduces fluoride from 5.0 to 0.2 ppm with zero wastewater discharge at ₹0.04 per liter.',
        methodology:
          'Utilizes pyrolyzed rice husk matrix impregnated with metal-organic nano-layers. Cartridge lasts 8 months before non-toxic thermal regeneration.',
        trlLevel: 6,
        estimatedBudget: 420000,
        durationWeeks: 16,
        prototypeUrl: 'https://github.com/aquashield/biochar-filter-iot',
        githubUrl: 'https://github.com/aquashield/groundwater-iot-telemetry',
        videoPitchUrl: 'https://youtube.com/watch?v=mockdemo1',
        upvotes: 184,
        status: 'pilot_approved',
        submittedAt: '2026-08-18',
        aiFeasibilityScore: 91,
        aiReviewSummary:
          'Exceptional thermodynamic adsorption rate. Highly cost-effective material pipeline using agro-waste. Recommended for rapid pilot deployment.',
        endorsements: 14,
        milestones: [
          {
            id: 'm1',
            title: 'Lab verification of 10,000L throughput',
            targetDate: '2026-09-15',
            fundsPercentage: 30,
            status: 'completed'
          },
          {
            id: 'm2',
            title: 'Field installation of 10 community pilot units in Ballia',
            targetDate: '2026-10-30',
            fundsPercentage: 50,
            status: 'in_review'
          },
          {
            id: 'm3',
            title: 'Certified NABL water lab compliance and handoff',
            targetDate: '2026-12-15',
            fundsPercentage: 20,
            status: 'pending'
          }
        ]
      },
      {
        id: 'SOL-102',
        challengeId: 'CH-26043-001',
        title: 'Solar-Powered Capacitive Deionization (CDI) Desalination Unit',
        teamName: 'VoltWater Systems',
        teamLead: {
          name: 'Vikram Sethi',
          email: 'vikram@voltwater.tech',
          organizationOrCollege: 'Startup India Incubator'
        },
        abstract:
          'Low-voltage pulsed capacitive deionization removing ions including fluoride and arsenic with 90% water recovery, powered entirely by 120W monocrystalline rooftop panel.',
        methodology:
          'Porous carbon aerogel electrodes with periodic charge reversal for self-cleaning desorption.',
        trlLevel: 5,
        estimatedBudget: 650000,
        durationWeeks: 20,
        upvotes: 92,
        status: 'submitted',
        submittedAt: '2026-08-20',
        aiFeasibilityScore: 84,
        aiReviewSummary:
          'High technological innovation and low energy footprint. Slightly higher initial CAPEX for rural panchayats, but OPEX is minimal.',
        endorsements: 8,
        milestones: [
          {
            id: 'm1',
            title: 'Bench scale prototype optimization',
            targetDate: '2026-09-20',
            fundsPercentage: 40,
            status: 'pending'
          }
        ]
      }
    ],
    comments: [
      {
        id: 'c1',
        authorName: 'Dr. S. K. Nair',
        authorRole: 'evaluator',
        authorOrg: 'National Institute of Hydrology',
        text: 'The NABL certified lab data is critical. We recommend testing on both pre-monsoon and post-monsoon water table samples.',
        createdAt: '2026-08-16T10:30:00Z',
        isOfficialUpdate: true
      },
      {
        id: 'c2',
        authorName: 'Surendra Yadav',
        authorRole: 'citizen',
        text: 'Our village primary school had 3 children diagnosed with fluorosis last month. We urgently need the 10 community pilot units installed!',
        createdAt: '2026-08-19T14:15:00Z'
      }
    ],
    verifiedByOfficial: true,
    officialVerifierName: 'District Collector Office, Ballia'
  },
  {
    id: 'CH-26043-002',
    title: 'Cold Chain Failure & Perishable Post-Harvest Spoilage in Tribal Farming Belts',
    category: 'Agriculture & Agritech',
    sdgNumber: 2,
    sdgName: 'Zero Hunger & Sustainable Agriculture',
    description:
      'Tribal tomato and ginger farmers in Dindori & Mandla face 38% post-harvest spoilage within 72 hours due to lack of grid electricity and high midday temperatures (42°C). Middlemen exploit distress selling at ₹2/kg.',
    impactedPopulation: 18500,
    location: {
      city: 'Dindori',
      state: 'Madhya Pradesh',
      country: 'India',
      latitude: 22.9500,
      longitude: 81.0800,
      address: 'Samnapur Tribal Block',
      pincode: '481880'
    },
    severity: 'High',
    severityScore: 88,
    status: 'open_for_solutions',
    reportedBy: {
      name: 'Sunita Maravi',
      role: 'citizen',
      organization: 'Dindori Mahila Kisan Producer Co.'
    },
    reportedDate: '2026-08-16',
    upvotes: 395,
    bountyAmount: 500000,
    sponsors: [
      {
        id: 'sp-3',
        name: 'NABARD Rural Innovation Fund',
        type: 'Government',
        amount: 350000
      },
      {
        id: 'sp-4',
        name: 'ITC Agri-CSR Trust',
        type: 'Corporate',
        amount: 150000
      }
    ],
    evidenceImages: [
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80'
    ],
    primaryTechDisciplines: [
      'Thermal Phase Change Materials (PCM)',
      'Solar Thermal Refrigeration',
      'IoT Supply Chain Tracking'
    ],
    aiAnalysis: {
      summary:
        'Passive or decentralized solar micro-cold rooms maintaining 8-12°C with 5 days thermal backup without batteries.',
      rootCauses: [
        'Frequent 14-hour daily grid blackouts in tribal highlands',
        'High cost of traditional diesel-generator cold storages',
        'Distances of >65km to district wholesale mandis'
      ],
      suggestedApproaches: [
        'Evaporative passive cooling structures combined with bio-PCM packs',
        'Direct-drive solar DC compressors with thermal ice-slurry energy storage',
        'Micro-cold storage on wheels for farmgate aggregation'
      ],
      potentialRisks: ['Rodent damage to insulation materials', 'Seasonal humidity fluctuations'],
      estimatedTimelineMonths: 4,
      recommendedTRLTarget: 6
    },
    solutionsCount: 2,
    solutions: [
      {
        id: 'SOL-201',
        challengeId: 'CH-26043-002',
        title: 'Sub-Zero PCM Solar Cold Pod with Zero Battery Maintenance',
        teamName: 'AgroFrost Lab (VNIT Nagpur)',
        teamLead: {
          name: 'Pratik Joshi',
          email: 'pratik@agrofrost.in',
          organizationOrCollege: 'VNIT Nagpur'
        },
        abstract:
          'A 5-metric-ton walk-in solar cold storage running on inorganic salt-hydrate phase change material (PCM). Stores cold thermal energy during daylight and discharges for 48 hours during cloudy weather.',
        methodology:
          'Direct-drive brushless DC compressor connected directly to 3kW solar array. Zero lead-acid or lithium battery overhead.',
        trlLevel: 7,
        estimatedBudget: 380000,
        durationWeeks: 12,
        upvotes: 145,
        status: 'pilot_approved',
        submittedAt: '2026-08-21',
        aiFeasibilityScore: 93,
        aiReviewSummary:
          'Superb design eliminating battery degradation costs. Payback period is under 14 months for the FPO.',
        endorsements: 12,
        milestones: [
          {
            id: 'm1',
            title: 'Thermal chamber fabrication & telemetry setup',
            targetDate: '2026-09-30',
            fundsPercentage: 50,
            status: 'in_review'
          }
        ]
      }
    ],
    comments: [
      {
        id: 'c3',
        authorName: 'Rohan Verma',
        authorRole: 'government_csr',
        authorOrg: 'NABARD',
        text: 'We are willing to co-fund 5 units if the field test proves tomato shelf-life extension from 3 to 14 days.',
        createdAt: '2026-08-22T09:00:00Z',
        isOfficialUpdate: true
      }
    ],
    verifiedByOfficial: true,
    officialVerifierName: 'District Horticulture Officer, Dindori'
  },
  {
    id: 'CH-26043-003',
    title: 'Urban Flash Flood & Drain Clogging Early Warning IoT Beacons',
    category: 'Disaster Management',
    sdgNumber: 11,
    sdgName: 'Sustainable Cities & Communities',
    description:
      'Monsoon stormwater drains in low-lying residential clusters (56 square km) experience catastrophic inundation within 20 minutes due to solid plastic waste choke points. Municipal control rooms receive no real-time telemetry until streets are submerged under 3 feet of water.',
    impactedPopulation: 210000,
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'Bellandur & Rainbow Drive Catchment',
      pincode: '560037'
    },
    severity: 'High',
    severityScore: 86,
    status: 'open_for_solutions',
    reportedBy: {
      name: 'Harish Narayanan',
      role: 'citizen',
      organization: 'Civic Bengaluru Resident Federation'
    },
    reportedDate: '2026-08-10',
    upvotes: 567,
    bountyAmount: 600000,
    sponsors: [
      {
        id: 'sp-5',
        name: 'Smart Cities Mission Innovation Grant',
        type: 'Government',
        amount: 400000
      },
      {
        id: 'sp-6',
        name: 'Wipro Sustainability CSR',
        type: 'Corporate',
        amount: 200000
      }
    ],
    evidenceImages: [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
    ],
    primaryTechDisciplines: [
      'Ultrasonic / Radar Level Sensing',
      'LoRaWAN Mesh Telemetry',
      'AI Predictive Hydrology Modeling'
    ],
    aiAnalysis: {
      summary:
        'Self-cleaning, non-contact ultrasonic and acoustic drain monitors running on LoRaWAN with automated sluice gate alerting.',
      rootCauses: [
        'Rapid unmanaged concretization reducing soil percolation',
        'Lack of real-time monitoring across 800+ culvert bottleneck junctions',
        'Delayed manual desilting response'
      ],
      suggestedApproaches: [
        'Solar/kinetic energy harvesting non-contact radar sensors mounted on manhole bridges',
        'LoRaWAN gateway network sending 60-second flood forecast updates to municipal control room',
        'Citizen WhatsApp alert bot based on localized 15-minute predictive modeling'
      ],
      potentialRisks: ['Vandalism or sensor theft', 'Corrosive sewer hydrogen sulfide gas'],
      estimatedTimelineMonths: 5,
      recommendedTRLTarget: 7
    },
    solutionsCount: 2,
    solutions: [
      {
        id: 'SOL-301',
        challengeId: 'CH-26043-003',
        title: 'HydroMesh: Corrosion-Proof LoRaWAN Acoustic Drain Beacons',
        teamName: 'HydroMesh Technologies',
        teamLead: {
          name: 'Nikhil Ranganathan',
          email: 'nikhil@hydromesh.io',
          organizationOrCollege: 'IISc Bengaluru Innovation Center'
        },
        abstract:
          'IP68 sealed dual acoustic and ultrasonic sensors mounted inside stormwater channels. Uses Edge-AI to detect debris blockages 4 hours before overflow and pushes SMS alerts to BBMP response teams.',
        methodology:
          'Epoxy potted radar with 5-year primary lithium battery. LoRaWAN long-range mesh covering 10 km radius per gateway.',
        trlLevel: 7,
        estimatedBudget: 450000,
        durationWeeks: 14,
        prototypeUrl: 'https://hydromesh.io/dashboard/demo',
        upvotes: 210,
        status: 'pilot_approved',
        submittedAt: '2026-08-15',
        aiFeasibilityScore: 94,
        aiReviewSummary:
          'Robust IP68 industrial design with corrosion resistance. Proven LoRaWAN battery longevity in field conditions.',
        endorsements: 19,
        milestones: [
          {
            id: 'm1',
            title: 'Deploy 25 beacons in Bellandur culvert network',
            targetDate: '2026-09-25',
            fundsPercentage: 60,
            status: 'completed'
          },
          {
            id: 'm2',
            title: 'Integration with City Command Center GIS map',
            targetDate: '2026-10-20',
            fundsPercentage: 40,
            status: 'in_review'
          }
        ]
      }
    ],
    comments: [
      {
        id: 'c4',
        authorName: 'BBMP Smart City Chief Engineer',
        authorRole: 'government_csr',
        text: 'The pilot test in Bellandur successfully predicted 2 severe blockages during last Tuesday’s downpour. We are approving milestone 2.',
        createdAt: '2026-08-25T11:45:00Z',
        isOfficialUpdate: true
      }
    ],
    verifiedByOfficial: true,
    officialVerifierName: 'BBMP Disaster Management Cell'
  },
  {
    id: 'CH-26043-004',
    title: 'Remote Maternal Health Tele-Diagnostics for Isolated Hill Hamlets',
    category: 'Rural Healthcare',
    sdgNumber: 3,
    sdgName: 'Good Health and Well-being',
    description:
      'High-altitude Himalayan hamlets in Chamoli & Pithoragarh lack obstetric ultrasound, pre-eclampsia biomarkers, and fetal heart rate monitors. Pregnant mothers travel 6 hours on foot across mountain trails during labor emergencies, leading to high preventable maternal mortality.',
    impactedPopulation: 14200,
    location: {
      city: 'Chamoli',
      state: 'Uttarakhand',
      country: 'India',
      latitude: 30.4200,
      longitude: 79.3300,
      address: 'Joshimath & Ghat Sub-Districts',
      pincode: '246443'
    },
    severity: 'Critical',
    severityScore: 96,
    status: 'open_for_solutions',
    reportedBy: {
      name: 'Radha Devi Rawat',
      role: 'citizen',
      organization: 'ASHA Health Worker Collective'
    },
    reportedDate: '2026-08-12',
    upvotes: 620,
    bountyAmount: 900000,
    sponsors: [
      {
        id: 'sp-7',
        name: 'National Health Mission (Uttarakhand)',
        type: 'Government',
        amount: 600000
      },
      {
        id: 'sp-8',
        name: 'Bill & Melinda Gates Foundation Partner',
        type: 'CSR Foundation',
        amount: 300000
      }
    ],
    evidenceImages: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
    ],
    primaryTechDisciplines: [
      'Point-of-Care Ultrasound (POCUS)',
      'Edge AI Diagnostic Screening',
      'Solar Backpack Telemedicine',
      'Offline Synchronized EHR'
    ],
    aiAnalysis: {
      summary:
        'All-in-one lightweight solar tele-diagnostic kit for ASHA workers with AI-guided ultrasound sweep for fetal position and placenta previa detection without requiring trained sonographers on-site.',
      rootCauses: [
        'Geographical isolation and seasonal snowfall road blockages',
        'Severe shortage of specialized obstetricians in primary health centers',
        'Intermittent satellite/cellular connectivity'
      ],
      suggestedApproaches: [
        'Handheld USB-C ultrasound probe with Edge-AI automated fetal heart and gestational age measurement',
        'Low-cost dry-reagent strip reader for protein-creatinine ratio (pre-eclampsia) and hemoglobin',
        'Store-and-forward satellite sync when connectivity is established'
      ],
      potentialRisks: ['Regulatory compliance for PNDT Act', 'Device ruggedization against sub-zero temperatures'],
      estimatedTimelineMonths: 6,
      recommendedTRLTarget: 7
    },
    solutionsCount: 2,
    solutions: [
      {
        id: 'SOL-401',
        challengeId: 'CH-26043-004',
        title: 'MajiCare: AI-Guided Handheld Maternal Screening Backpack',
        teamName: 'BioCare Hill MedTech (AIIMS Rishikesh & IIT Roorkee)',
        teamLead: {
          name: 'Dr. Tanya Mukherjee',
          email: 'tanya.med@iitr.ac.in',
          organizationOrCollege: 'IIT Roorkee'
        },
        abstract:
          'A 2.5 kg shockproof solar backpack carrying a handheld AI ultrasound, 6-in-1 vital sign strip analyzer, and offline triage assistant that empowers rural ASHA workers to detect high-risk pregnancies 8 weeks before delivery.',
        methodology:
          'On-device deep neural network runs on Android tablet without internet. Generates color-coded risk flag (Green/Yellow/Red) and queues automated helicopter evacuation request when critical pre-eclampsia is detected.',
        trlLevel: 7,
        estimatedBudget: 550000,
        durationWeeks: 16,
        prototypeUrl: 'https://majicare.health/demo',
        upvotes: 289,
        status: 'pilot_approved',
        submittedAt: '2026-08-17',
        aiFeasibilityScore: 96,
        aiReviewSummary:
          'Remarkably well-conceived clinical safety protocols. The offline edge inference matches 94.2% sensitivity of certified sonologists for placenta previa.',
        endorsements: 24,
        milestones: [
          {
            id: 'm1',
            title: 'ASHA field training cohort of 20 healthcare workers in Chamoli',
            targetDate: '2026-09-18',
            fundsPercentage: 40,
            status: 'completed'
          },
          {
            id: 'm2',
            title: 'Live screening of 300 pregnant mothers with AIIMS validation',
            targetDate: '2026-11-10',
            fundsPercentage: 60,
            status: 'in_review'
          }
        ]
      }
    ],
    comments: [
      {
        id: 'c5',
        authorName: 'Chief Medical Officer, Chamoli',
        authorRole: 'government_csr',
        text: 'The MajiCare kits have already flagged 4 critical twin gestations and 2 severe pre-eclampsia cases early, enabling timely institutional delivery.',
        createdAt: '2026-08-23T14:20:00Z',
        isOfficialUpdate: true
      }
    ],
    verifiedByOfficial: true,
    officialVerifierName: 'Uttarakhand State Health Mission'
  },
  {
    id: 'CH-26043-005',
    title: 'Smart Streetlighting & Safe Corridor Navigation for Women Night Shift Commuters',
    category: 'Women Safety & Inclusion',
    sdgNumber: 5,
    sdgName: 'Gender Equality & Safe Public Spaces',
    description:
      'Industrial and garment manufacturing corridors in Peenya & Bommasandra have 14 km of pitch-dark alleys with broken sodium streetlamps. Over 12,000 women garment workers finishing 8 PM to 11 PM shifts face harassment and unsafe walking stretches to transit hubs.',
    impactedPopulation: 28000,
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      latitude: 13.0300,
      longitude: 77.5200,
      address: 'Peenya Industrial Estate Phase 2 & 3',
      pincode: '560058'
    },
    severity: 'High',
    severityScore: 89,
    status: 'open_for_solutions',
    reportedBy: {
      name: 'Kavitha Ramaswamy',
      role: 'citizen',
      organization: 'Garment & Textile Workers Union'
    },
    reportedDate: '2026-08-11',
    upvotes: 512,
    bountyAmount: 450000,
    sponsors: [
      {
        id: 'sp-9',
        name: 'UN Women Safe Cities Innovation Fund',
        type: 'NGO',
        amount: 300000
      },
      {
        id: 'sp-10',
        name: 'Titan Foundation CSR',
        type: 'Corporate',
        amount: 150000
      }
    ],
    evidenceImages: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80'
    ],
    primaryTechDisciplines: [
      'Solar Smart Lighting Poles',
      'AI Acoustic Screaming/Distress Detection',
      'Safe Walk Escort Mobile Mesh'
    ],
    aiAnalysis: {
      summary:
        'Solar-powered kinetic motion-activated LED smart poles equipped with panic SOS siren buttons, 360-degree flashing beacon, and mesh connected auto-dispatch to local police patrol bikes.',
      rootCauses: [
        'Grid infrastructure vandalism and unmetered power cuts in industrial outskirts',
        'Lack of formal bus stops within 1.5 km of factory gates',
        'Delayed police emergency response due to vague landmarks'
      ],
      suggestedApproaches: [
        'Autonomous Solar Smart Light Poles with tamper-proof lithium ferro-phosphate batteries',
        'Physical SOS emergency button that sounds 110dB acoustic alarm and transmits exact GPS coordinate',
        'SafeCorridor peer-escort digital tracking app'
      ],
      potentialRisks: ['Camera privacy concerns vs deterrent impact', 'Maintenance of solar panel dust cleanliness'],
      estimatedTimelineMonths: 3,
      recommendedTRLTarget: 7
    },
    solutionsCount: 1,
    solutions: [
      {
        id: 'SOL-501',
        challengeId: 'CH-26043-005',
        title: 'NirbhayPoles: Autonomous Solar SOS Smart Beacons with Mesh Alarm',
        teamName: 'SafeCity Tech Labs',
        teamLead: {
          name: 'Shruti Iyer',
          email: 'shruti@safecitytech.org',
          organizationOrCollege: 'BMS College of Engineering'
        },
        abstract:
          'Ruggedized solar lighting poles with radar movement sensing that boosts illumination from 20% to 100% when pedestrians approach. Includes physical tactile SOS button triggering strobe lights and cellular distress alert.',
        methodology:
          'Stand-alone 80W bifacial solar pole with 48-hour power reserve. Built-in 4G/NB-IoT modem transmitting audio-visual alert to nearest PCR van.',
        trlLevel: 8,
        estimatedBudget: 320000,
        durationWeeks: 8,
        upvotes: 198,
        status: 'pilot_approved',
        submittedAt: '2026-08-16',
        aiFeasibilityScore: 92,
        aiReviewSummary:
          'High readiness level (TRL 8). Directly addresses both illumination deficit and instant deterrence.',
        endorsements: 16,
        milestones: [
          {
            id: 'm1',
            title: 'Installation of 30 Nirbhay Poles along 3 km Peenya corridor',
            targetDate: '2026-09-30',
            fundsPercentage: 70,
            status: 'in_review'
          }
        ]
      }
    ],
    comments: [],
    verifiedByOfficial: true,
    officialVerifierName: 'Karnataka State Women Safety Directorate'
  },
  {
    id: 'CH-26043-006',
    title: 'Informal E-Waste Dismantler Toxic Lead & Mercury Exposure Mitigation',
    category: 'Waste Management & Circular Economy',
    sdgNumber: 12,
    sdgName: 'Responsible Consumption and Production',
    description:
      'Over 4,500 informal e-waste recycling workers in Seelampur & Moradabad burn printed circuit boards (PCBs) and acid-leach copper in unventilated slums, releasing toxic dioxins, lead, and mercury vapors causing severe respiratory ailments and soil toxicity.',
    impactedPopulation: 52000,
    location: {
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      latitude: 28.6692,
      longitude: 77.2684,
      address: 'Seelampur Informal E-Waste Cluster',
      pincode: '110053'
    },
    severity: 'High',
    severityScore: 91,
    status: 'open_for_solutions',
    reportedBy: {
      name: 'Mohd. Zafar Ansari',
      role: 'citizen',
      organization: 'Green Circular Welfare Association'
    },
    reportedDate: '2026-08-08',
    upvotes: 340,
    bountyAmount: 800000,
    sponsors: [
      {
        id: 'sp-11',
        name: 'Ministry of Electronics & IT (MeitY) Green Scheme',
        type: 'Government',
        amount: 500000
      },
      {
        id: 'sp-12',
        name: 'Infosys Circularity Foundation',
        type: 'CSR Foundation',
        amount: 300000
      }
    ],
    evidenceImages: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'
    ],
    primaryTechDisciplines: [
      'Hydrometallurgical Green Chemistry',
      'Micro-Scale Fume Scrubbing',
      'Reverse Logistics Digital Marketplace'
    ],
    aiAnalysis: {
      summary:
        'Compact benchtop chemical stripping unit using non-toxic ionic liquids or organic acids to recover gold/copper without open-air burning or nitric acid fumes.',
      rootCauses: [
        'Informal dismantlers lack capital for industrial smelters',
        'Economic survival dependent on extracting ₹800-₹1500 precious metals per day',
        'Absence of formal aggregation hubs offering fair buy-back prices'
      ],
      suggestedApproaches: [
        'Citric-acid-assisted low temperature electrolytic metal extraction chamber',
        'Slum-compatible mobile fume extraction hood with activated carbon and HEPA filters',
        'Direct UPI payout formal marketplace bridging formal recyclers with micro-dismantlers'
      ],
      potentialRisks: ['Handling of chemical residues', 'Resistance to changing age-old scrap handling customs'],
      estimatedTimelineMonths: 5,
      recommendedTRLTarget: 6
    },
    solutionsCount: 1,
    solutions: [
      {
        id: 'SOL-601',
        challengeId: 'CH-26043-006',
        title: 'BioLeach Micro-Kit: Safe Enzyme-Assisted Precious Metal Extractor',
        teamName: 'CirculaChem (IIT Delhi)',
        teamLead: {
          name: 'Aakash Singhal',
          email: 'aakash@circulachem.in',
          organizationOrCollege: 'IIT Delhi'
        },
        abstract:
          'A closed-loop non-acidic bio-hydrometallurgical reactor that extracts 96% gold, silver, and copper from crushed PCB powder using non-hazardous organic lixiviants with zero toxic emissions.',
        methodology:
          'Utilizes food-grade glycine-thiosulfate reagents at room temperature (35°C). Modular 20-liter reactor fits on a cycle rickshaw.',
        trlLevel: 6,
        estimatedBudget: 480000,
        durationWeeks: 18,
        upvotes: 165,
        status: 'submitted',
        submittedAt: '2026-08-19',
        aiFeasibilityScore: 89,
        aiReviewSummary:
          'Eliminates nitric acid and cyanide risks. Reagents are reusable up to 12 cycles, reducing chemical costs.',
        endorsements: 11,
        milestones: []
      }
    ],
    comments: [],
    verifiedByOfficial: true,
    officialVerifierName: 'Central Pollution Control Board Advisory Cell'
  }
];
