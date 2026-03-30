export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'BeinBout App API',
        version: '1.0.0',
        description: 'Dokumentasi API untuk aplikasi BeinBout',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local Server',
        },
        {
            url: 'https://beinbout-be.vercel.app',
            description: 'Production Server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    username: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    google_id: { type: 'string' },
                    avatar_url: { type: 'string' },
                    nama_lengkap: { type: 'string' },
                    berat_badan: { type: 'number' },
                    tinggi_badan: { type: 'number' },
                    umur: { type: 'integer' },
                    tanggal_lahir: { type: 'string', format: 'date' },
                    last_login_at: { type: 'string', format: 'date-time' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' }
                }
            },
            Quiz: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    user_id: { type: 'integer' },
                    type: { type: 'string' },
                    total_question: { type: 'integer' },
                    answered_question: { type: 'integer' },
                    total_score: { type: 'integer' },
                    ai_summary: { type: 'string' },
                    ai_insights: { type: 'json' },
                    started_at: { type: 'string', format: 'date' },
                    compeleted_at: { type: 'string', format: 'date' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' }
                }
            },
            QuizQuestion: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    category: { type: 'string' },
                    question_text: { type: 'string' },
                    question_type: { type: 'string' },
                    quiz_type: { type: 'string', enum: ['initial', 'weekly_static', 'weekly_random'] },
                    is_active: { type: 'boolean' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' },
                    options: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/QuizOption' }
                    }
                }
            },
            QuizOption: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    question_id: { type: 'integer' },
                    option_text: { type: 'string' },
                    score_value: { type: 'integer' },
                    emotion_tag: { type: 'string' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' },
                }
            },
            QuizAnswer: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    quiz_id: { type: 'integer' },
                    question_id: { type: 'integer' },
                    selected_option_id: { type: 'integer' },
                    custom_answer: { type: 'string' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' },
                }
            },
            JournalLog: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    user_id: { type: 'integer' },
                    entry_date: { type: 'string', format: 'date' },
                    mood: { type: 'string' },
                    mood_intensity: { type: 'integer' },
                    sleep_time: { type: 'string' },
                    wake_time: { type: 'string' },
                    sleep_duration_hours: { type: 'number' },
                    sleep_quality: { type: 'string' },
                    title: { type: 'string' },
                    content: { type: 'string' },
                    ai_reflection: { type: 'string' },
                    ai_tags: { type: 'json' },
                    ai_sentiment_score: { type: 'number' },
                    ai_anomaly_detected: { type: 'boolean' },
                    ai_anomaly_type: { type: 'string' },
                    ai_low_confidance: { type: 'boolean' },
                    is_private: { type: 'boolean' },
                    is_deleted: { type: 'boolean' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' },
                }
            },
            UserPersona: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    user_id: { type: 'integer' },
                    risk_level: { type: 'string' },
                    risk_score: { type: 'int' },
                    dominant_stressor: { type: 'json' },
                    recommendations: { type: 'json' },
                    personality_summary: { type: 'string' },
                    weekly_insight: { type: 'string' },
                    progress_status: { type: 'string' },
                    source_type: { type: 'string' },
                    source_id: { type: 'bigInt' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' },
                }
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'error' },
                    message: { type: 'string' },
                    error: { type: 'string' }
                }
            },
            SuccessResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'success' },
                    message: { type: 'string' },
                    data: { type: 'object' }
                }
            }
        }
    },
    paths: {
        '/api/v1/auth/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Mendaftarkan akun baru',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['username', 'email', 'password'],
                                properties: {
                                    username: { type: 'string' },
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Berhasil mendaftar',
                        content: {
                            'application/json': {
                                example: {
                                    status: 'success',
                                    message: 'Register Successful!',
                                    data: {
                                        newUser: {
                                            id: 1,
                                            username: 'tester123',
                                            email: 'testing@example.com',
                                            email_verified_at: null,
                                            password: 'examplehashedpassword',
                                            google_id: null,
                                            avatar_url: null,
                                            nama_lengkap: null,
                                            berat_badan: null,
                                            tinggi_badan: null,
                                            umur: null,
                                            tanggal_lahir: null,
                                            last_login_at: '2026-03-30T08:00:14.868Z',
                                            created_at: '2026-03-30T08:00:14.887Z',
                                            updated_at: '2026-03-30T08:00:14.887Z'
                                        },
                                        has_completed_quiz: false,
                                        token: 'exampleToken',
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Email sudah terdaftar',
                        content: {
                            'application/json': {
                                example: {
                                    status: 'error',
                                    message: 'Email already exists',
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'A server error occurred',
                                }
                            }
                        }
                    }
                },
            }
        },
        '/api/v1/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Login ke akun yang sudah ada',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login berhasil',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    message: 'Login successful!',
                                    data: {
                                        user: {
                                            id: 1,
                                            username: 'tester123',
                                            email: 'testing@example.com',
                                            email_verified_at: null,
                                            password: 'examplehashedpassword',
                                            google_id: null,
                                            avatar_url: null,
                                            nama_lengkap: null,
                                            berat_badan: null,
                                            tinggi_badan: null,
                                            umur: null,
                                            tanggal_lahir: null,
                                            last_login_at: '2026-03-30T08:00:14.868Z',
                                            created_at: '2026-03-30T08:00:14.887Z',
                                            updated_at: '2026-03-30T08:00:14.887Z'
                                        },
                                        token: 'exampleToken',
                                    }
                                },
                            },
                        },
                    },
                    400: {
                        description: 'User sebelumnya login menggunakan Google',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Please login using Google.'
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Email atau password salah',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Invalid email or password'
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Pengguna tidak ditemukan',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Invalid email or password'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'A server error occurred',
                                }
                            }
                        }
                    }
                },
            }
        },
        '/api/v1/auth/google-oauth': {
            post: {
                tags: ['Authentication'],
                summary: 'Login menggunakan Google OAuth',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email'],
                                properties: {
                                    email: { type: 'string' },
                                    nama_lengkap: { type: 'string' },
                                    avatar_url: { type: 'string' },
                                    google_id: { type: 'string' }
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login dengan Google berhasil',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    message: 'Successfully logged in using Google',
                                    data: {
                                        user: {
                                            id: 1,
                                            email: 'user@gmail.com',
                                            username: 'user123',
                                            nama_lengkap: 'User Name',
                                            avatar_url: 'https://lh3.googleusercontent.com/...'
                                        },
                                        has_completed_quiz: false,
                                        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                    }
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'A server error occurred',
                                }
                            }
                        }
                    }
                },
            }
        },
        '/api/v1/auth/logout': {
            post: {
                tags: ['Authentication'],
                summary: 'Logout dari akun',
                responses: {
                    200: {
                        description: 'Logout berhasil',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    message: 'Logout successful!'
                                },
                            },
                        },
                    }
                },
            }
        },
        '/api/v1/showing-questions': {
            get: {
                tags: ['Quiz & Profile'],
                summary: 'Mengambil soal kuis berdasarkan tipe',
                parameters: [
                    {
                        name: 'type',
                        in: 'query',
                        required: true,
                        schema: { type: 'string', enum: ['initial', 'weekly'] },
                        description: 'Tipe kuis "initial" (20 soal) atau "weekly" (10 soal)',
                    },
                ],
                responses: {
                    200: {
                        description: 'Berhasil mengambil soal',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    data: [
                                        {
                                            id: 1,
                                            category: 'Stress',
                                            question_text: 'Seberapa sering kamu merasa tertekan atau overwhelmed minggu ini?',
                                            question_type: 'multiple_choice',
                                            quiz_type: 'initial',
                                            is_active: true,
                                            created_at: '2026-03-30T03:55:07.081Z',
                                            updated_at: '2026-03-30T03:55:07.081Z',
                                            options: [
                                                { 
                                                    id: 61,
                                                    question_id: 12,
                                                    option_text: 'Tidak Pernah',
                                                    score_value: 1,
                                                    emotion_tag: 'weekly_stress',
                                                    created_at: '2026-03-30T03:55:07.081Z',
                                                    updated_at: '2026-03-30T03:55:07.081Z'
                                                },
                                                '...'
                                            ]
                                        },
                                        '...'
                                    ]
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Tipe kuis tidak valid',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/shemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Type is required (example: ?type=initial or ?type=random)'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Internal server error',
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/profile-and-inpe': {
            post: {
                tags: ['Quiz & Profile'],
                summary: 'Setup profil dan kuis persona awal',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nama_lengkap', 'umur', 'berat_badan', 'tinggi_badan', 'quiz_answers'],
                                properties: {
                                    nama_lengkap: { type: 'string' },
                                    umur: { type: 'integer' },
                                    berat_badan: { type: 'number' },
                                    tinggi_badan: { type: 'number' },
                                    quiz_answers: {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'object',
                                            required: ['question_id', 'selected_option_id'],
                                            properties: {
                                                question_id: { type: 'integer' },
                                                selected_option_id: { type: 'integer' }
                                            }
                                        },
                                        description: 'Array jawaban kuis persona awal'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Profil dan kuis berhasil disimpan, lalu ai akan memberikan response',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    message: 'Profile and quiz successfully saved, AI has responded',
                                    data: {
                                        ai_summary: 'Kamu cenderung memendam tekanan akademik yang cukup berat akhir-akhir ini. Kurangnya waktu istirahat membuat tubuh dan pikiranmu terus berada dalam mode waspada, yang pada akhirnya memicu kelelahan emosional.',
                                        ai_insights: {
                                            risk_level: 'moderate',
                                            risk_score: 62,
                                            dominant_stressor: ['academic_pressure', 'sleep_disorder'],
                                            personality_summary: 'Kamu adalah tipe yang perfeksionis dan sangat bertanggung jawab, namun hal ini terkadang membuatmu mengabaikan sinyal kelelahan dari tubuhmu sendiri.',
                                            recommendations: [
                                                {
                                                    focus: 'Kualitas Tidur',
                                                    description: 'Coba tetapkan jam tidur yang sama selama 3 hari ke depan, matikan layar gadget 30 menit sebelum tidur.',
                                                },
                                                {
                                                    focus: 'Manajemen Ekspetasi',
                                                    description: 'Pecah tugas akademikmu menjadi bagian-bagian kecil agar tidak terasa terlalu mengintimidasi.'
                                                }
                                            ],
                                            progress_status: null,
                                            weekly_insight: null,
                                            ai_low_confidance: false
                                        }
                                    },
                                    quiz: {
                                        id: 45,
                                        type: 'initial_persona',
                                        total_question: 20,
                                        answered_question: 20,
                                        total_score: 45
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Profil sudah diisi',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Profile has been filled in'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Failed to process profile & AI data',
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/daily-journal': {
            get: {
                tags: ['Daily Journal'],
                summary: 'Mengambil riwayat jurnal per bulan',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { 
                        name: 'month', 
                        in: 'query', 
                        schema: { type: 'integer', minimum: 1, maximum: 12 },
                        description: 'Bulan (1-12), default: bulan saat ini'
                    },
                    { 
                        name: 'year', 
                        in: 'query', 
                        schema: { type: 'integer', minimum: 2020, maximum: 2030 },
                        description: 'Tahun, default: tahun saat ini'
                    }
                ],
                responses: {
                    200: {
                        description: 'Berhasil mengambil riwayat jurnal per bulan',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    data: [
                                        { 
                                            id: 1, 
                                            entry_date: '2023-06-01', 
                                            mood: 'happy', 
                                            is_private: false 
                                        },
                                        { 
                                            id: 2, 
                                            entry_date: '2023-06-02', 
                                            mood: 'sad', 
                                            is_private: true 
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Internal Server Error',
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Daily Journal'],
                summary: 'Membuat jurnal harian baru',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['journal_date', 'mood', 'mood_intensity'],
                                properties: {
                                    journal_date: { 
                                        type: 'string', 
                                        format: 'date',
                                        description: 'Tanggal jurnal (YYYY-MM-DD)'
                                    },
                                    mood: { 
                                        type: 'string',
                                        enum: ['happy', 'sad', 'angry', 'anxious', 'neutral', 'excited', 'tired'],
                                        description: 'Mood utama'
                                    },
                                    mood_intensity: { 
                                        type: 'integer',
                                        minimum: 1,
                                        maximum: 5,
                                        description: 'Intensitas mood (1-5)'
                                    },
                                    sleep_time: { 
                                        type: 'string',
                                        pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                                        description: 'Waktu tidur (HH:MM)'
                                    },
                                    wake_time: { 
                                        type: 'string',
                                        pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                                        description: 'Waktu bangun (HH:MM)'
                                    },
                                    sleep_quality: { 
                                        type: 'string',
                                        enum: ['poor', 'fair', 'good', 'excellent'],
                                        description: 'Kualitas tidur'
                                    },
                                    content: { 
                                        type: 'string',
                                        description: 'Isi jurnal (maksimal 5000 karakter)'
                                    },
                                    is_private: { 
                                        type: 'boolean',
                                        default: false,
                                        description: 'Apakah jurnal bersifat privat (tidak akan dianalisis AI)'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Jurnal berhasil disimpan',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                examples: {
                                    public: {
                                        summary: 'Jurnal Publik (dengan AI analysis)',
                                        value: {
                                            status: 'success',
                                            message: 'Journal successfully saved',
                                            data: {
                                                journal_id: 123,
                                                journal_date: '2023-06-01',
                                                is_private: false,
                                                ai_report: {
                                                    ai_reflection: 'Kamu sedang menghadapi tekanan yang cukup berat hari ini. Menarik napas panjang sejenak mungkin bisa membantu...',
                                                    ai_tags: ['academic_pressure', 'sleep_deficit'],
                                                    ai_sentiment_score: -0.72,
                                                    ai_anomaly_detected: true,
                                                    ai_anomaly_type: 'sleep_deficit'
                                                }
                                            }
                                        }
                                    },
                                    private: {
                                        summary: 'Jurnal Privat (tanpa AI analysis)',
                                        value: {
                                            status: 'success',
                                            message: 'Journal successfully saved privately',
                                            data: {
                                                journal_id: 124,
                                                journal_date: '2023-06-02',
                                                is_private: true,
                                                ai_report: null
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Request tidak valid',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                examples: {
                                    future_date: {
                                        summary: 'Tanggal di masa depan',
                                        value: {
                                            status: 'error',
                                            message: 'Cannot submit journal for future date'
                                        }
                                    },
                                    duplicate: {
                                        summary: 'Jurnal sudah ada',
                                        value: {
                                            status: 'error',
                                            message: 'Journal already exists for this date'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Internal Server Error',
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/daily-journal/{id}': {
            get: {
                tags: ['Daily Journal'],
                summary: 'Mengambil detail jurnal berdasarkan ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID jurnal'
                    }
                ],
                responses: {
                    200: {
                        description: 'Berhasil mengambil detail jurnal',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    data: {
                                        id: 1,
                                        entry_date: '2023-06-01',
                                        mood: 'happy',
                                        mood_intensity: 8,
                                        sleep_time: '22:00',
                                        wake_time: '06:00',
                                        sleep_duration_hours: 8.0,
                                        sleep_quality: 'good',
                                        content: 'Hari ini saya merasa bahagia...',
                                        is_private: false,
                                        ai_reflection: 'Berdasarkan jurnal Anda...',
                                        ai_tags: ['happy', 'productive', 'positive'],
                                        ai_sentiment_score: 0.8,
                                        ai_anomaly_detected: false,
                                        created_at: '2023-06-01T07:00:00.000Z'
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Jurnal tidak ditemukan',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Journal not found'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Internal Server Error',
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/weekly-checkup': {
            post: {
                tags: ['Weekly Checkup'],
                summary: 'Submit weekly checkup quiz',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['quiz_answers'],
                                properties: {
                                    quiz_answers: {
                                        type: 'array',
                                        minItems: 1,
                                        items: {
                                            type: 'object',
                                            required: ['question_id', 'selected_option_id'],
                                            properties: {
                                                question_id: { type: 'integer' },
                                                selected_option_id: { type: 'integer' }
                                            }
                                        },
                                        description: 'Array jawaban weekly checkup'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Weekly checkup berhasil diproses',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    message: 'Weekly-checkup is processed successfuly!',
                                    data: {
                                        quiz_id: 85,
                                        type: 'weekly_checkup',
                                        ai_summary: 'Berdasarkan weekly checkup Anda...',
                                        ai_insights: {
                                            risk_level: 'medium',
                                            risk_score: 45,
                                            dominant_stressor: ['academic_pressure', 'burnout'],
                                            personality_summary: 'Pola Anda menunjukkan...',
                                            recommendations: [
                                                {
                                                    focus: 'Tidur',
                                                    description: 'Tidurmu rata-rata 8 jam minggu ini...'
                                                }
                                            ],
                                            progress_status: 'stable',
                                            weekly_insight: 'Pekan ini menunjukkan peningkatan...',
                                            ai_low_confidance: false
                                        }
                                    },
                                    quiz: {
                                        id: 67,
                                        type: 'weekly_checkup',
                                        total_question: 10,
                                        answered_question: 10,
                                        total_score: 32
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Belum ada kuis awal atau request tidak valid',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'No initial persona or weekly checkup found for this user'
                                }
                            }
                        }
                    },
                    403: {
                        description: 'Weekly checkup hanya bisa dilakukan sekali seminggu',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Weekly checkup can only be submitted once a week. Please try again in 3 days.'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Internal Server Error',
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/admin/questions': {
            get: {
                tags: ['Admin'],
                summary: 'Get all quiz questions with options',
                responses: {
                    200: {
                        description: 'Berhasil mengambil semua soal',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    message: 'All questions fetched successfully',
                                    data: [
                                        {
                                            id: 1,
                                            category: 'anxiety',
                                            question_text: 'Seberapa sering kamu merasa cemas?',
                                            question_type: 'multiple_choice',
                                            quiz_type: 'initial',
                                            is_active: true,
                                            created_at: '2026-03-30T03:55:07.081Z',
                                            updated_at: '2026-03-30T03:55:07.081Z',
                                            options: [
                                                { id: 101, option_text: 'Tidak Pernah', score_value: 1, emotion_tag: 'calm', question_id: 25 },
                                                { id: 102, option_text: 'Jarang', score_value: 2, emotion_tag: 'calm', question_id: 25 },
                                                { id: 103, option_text: 'Kadang-kadang', score_value: 3, emotion_tag: 'calm', question_id: 25 },
                                                { id: 104, option_text: 'Sering', score_value: 4, emotion_tag: 'calm', question_id: 25 },
                                                { id: 105, option_text: 'Hampir Selalu', score_value: 5, emotion_tag: 'calm', question_id: 25 }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Internal Server Error',
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Admin'],
                summary: 'Create new quiz question',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['question_text', 'category', 'quiz_type'],
                                properties: {
                                    question_text: { 
                                        type: 'string',
                                        description: 'Teks pertanyaan'
                                    },
                                    category: { 
                                        type: 'string',
                                        description: 'Kategori pertanyaan'
                                    },
                                    quiz_type: { 
                                        type: 'string',
                                        enum: ['initial', 'weekly_static', 'weekly_random'],
                                        description: 'Tipe kuis'
                                    },
                                    emotion_tag: { 
                                        type: 'string',
                                        description: 'Tag emosi untuk opsi jawaban (opsional)'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Pertanyaan berhasil dibuat',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    message: 'Question created successfully',
                                    data: {
                                        id: 1,
                                        category: 'anxiety',
                                        question_text: 'Seberapa sering kamu merasa cemas?',
                                        question_type: 'multiple_choice',
                                        quiz_type: 'initial',
                                        is_active: true,
                                        created_at: '2026-03-30T03:55:07.081Z',
                                        updated_at: '2026-03-30T03:55:07.081Z',
                                        options: [
                                            { id: 101, option_text: 'Tidak Pernah', score_value: 1, emotion_tag: 'calm', question_id: 25 },
                                            { id: 102, option_text: 'Jarang', score_value: 2, emotion_tag: 'calm', question_id: 25 },
                                            { id: 103, option_text: 'Kadang-kadang', score_value: 3, emotion_tag: 'calm', question_id: 25 },
                                            { id: 104, option_text: 'Sering', score_value: 4, emotion_tag: 'calm', question_id: 25 },
                                            { id: 105, option_text: 'Hampir Selalu', score_value: 5, emotion_tag: 'calm', question_id: 25 }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Request tidak valid',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Question text, category, or quiz type are required.'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Internal Server Error',
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/admin/question/{id}': {
            get: {
                tags: ['Admin'],
                summary: 'Get question by ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID pertanyaan'
                    }
                ],
                responses: {
                    200: {
                        description: 'Berhasil mengambil pertanyaan',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    message: 'Question fetched successfully',
                                    data: {
                                        id: 1,
                                        category: 'anxiety',
                                        question_text: 'Seberapa sering kamu merasa cemas?',
                                        question_type: 'multiple_choice',
                                        quiz_type: 'initial',
                                        is_active: true,
                                        created_at: '2026-03-30T03:55:07.081Z',
                                        updated_at: '2026-03-30T03:55:07.081Z',
                                        options: [
                                            { id: 101, option_text: 'Tidak Pernah', score_value: 1, emotion_tag: 'calm', question_id: 25 },
                                            { id: 102, option_text: 'Jarang', score_value: 2, emotion_tag: 'calm', question_id: 25 },
                                            { id: 103, option_text: 'Kadang-kadang', score_value: 3, emotion_tag: 'calm', question_id: 25 },
                                            { id: 104, option_text: 'Sering', score_value: 4, emotion_tag: 'calm', question_id: 25 },
                                            { id: 105, option_text: 'Hampir Selalu', score_value: 5, emotion_tag: 'calm', question_id: 25 }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'ID tidak valid',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Question id is required'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Internal Server Error',
                                }
                            }
                        }
                    }
                }
            },
            put: {
                tags: ['Admin'],
                summary: 'Update question by ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID pertanyaan'
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['question_text', 'category', 'quiz_type'],
                                properties: {
                                    question_text: { 
                                        type: 'string',
                                        description: 'Teks pertanyaan'
                                    },
                                    category: { 
                                        type: 'string',
                                        description: 'Kategori pertanyaan'
                                    },
                                    quiz_type: { 
                                        type: 'string',
                                        enum: ['initial', 'weekly_static', 'weekly_random'],
                                        description: 'Tipe kuis'
                                    },
                                    emotion_tag: { 
                                        type: 'string',
                                        description: 'Tag emosi untuk opsi jawaban (opsional)'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Pertanyaan berhasil diperbarui',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    message: 'Question updated successfully',
                                    data: {
                                        id: 1,
                                        category: 'anxiety',
                                        question_text: 'Seberapa sering kamu merasa cemas?',
                                        question_type: 'multiple_choice',
                                        quiz_type: 'initial',
                                        is_active: true,
                                        created_at: '2026-03-30T03:55:07.081Z',
                                        updated_at: '2026-03-30T03:55:07.081Z',
                                        options: [
                                            { id: 101, option_text: 'Tidak Pernah', score_value: 1, emotion_tag: 'calm', question_id: 25 },
                                            { id: 102, option_text: 'Jarang', score_value: 2, emotion_tag: 'calm', question_id: 25 },
                                            { id: 103, option_text: 'Kadang-kadang', score_value: 3, emotion_tag: 'calm', question_id: 25 },
                                            { id: 104, option_text: 'Sering', score_value: 4, emotion_tag: 'calm', question_id: 25 },
                                            { id: 105, option_text: 'Hampir Selalu', score_value: 5, emotion_tag: 'calm', question_id: 25 }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Request tidak valid',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    id_validation: {
                                        status: 'error',
                                        message: 'Question id is required'
                                    },
                                    input_validation: {
                                        status: 'error',
                                        message: 'Question text, category, or quiz type are required.'
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Internal Server Error',
                                }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['Admin'],
                summary: 'Delete question by ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID pertanyaan'
                    }
                ],
                responses: {
                    200: {
                        description: 'Pertanyaan berhasil dihapus',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SuccessResponse' },
                                example: {
                                    status: 'success',
                                    message: 'Question deleted successfully',
                                    data: {
                                        id: 1,
                                        category: 'anxiety',
                                        question_text: 'Seberapa sering kamu merasa cemas?',
                                        question_type: 'multiple_choice',
                                        quiz_type: 'initial',
                                        is_active: true,
                                        created_at: '2026-03-30T03:55:07.081Z',
                                        updated_at: '2026-03-30T03:55:07.081Z',
                                        options: [
                                            { id: 101, option_text: 'Tidak Pernah', score_value: 1, emotion_tag: 'calm', question_id: 25 },
                                            { id: 102, option_text: 'Jarang', score_value: 2, emotion_tag: 'calm', question_id: 25 },
                                            { id: 103, option_text: 'Kadang-kadang', score_value: 3, emotion_tag: 'calm', question_id: 25 },
                                            { id: 104, option_text: 'Sering', score_value: 4, emotion_tag: 'calm', question_id: 25 },
                                            { id: 105, option_text: 'Hampir Selalu', score_value: 5, emotion_tag: 'calm', question_id: 25 }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'ID tidak valid',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Question id is required'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Terjadi kesalahan server',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                                example: {
                                    status: 'error',
                                    message: 'Internal Server Error',
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};