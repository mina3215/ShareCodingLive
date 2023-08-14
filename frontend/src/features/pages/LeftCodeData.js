const left_code_data =  [
  {
    "dateOfCourse": "2023-08-09",
    "courses": [
      {
        "title": "C++ 수업",
        "teacher": "테스트 유저",
        "codes": [
          {
            "title": "코드 제목",
            "content": "코드 내용",
            "created_time": "Fri Aug 04 16:36:01 KST 2023",
            "summarization": "코드 요약"
          }
        ]
      }
    ]
  },
  {
    "dateOfCourse": "2023-08-10",
    "courses": [
      {
        "title": "Java 수업",
        "teacher": "admin",
        "codes": [
          {
            "title": "코드 제목",
            "content": "코드 내용",
            "created_time": "Fri Aug 04 16:41:45 KST 2023",
            "summarization": "코드 요약"
          },
          {
            "title": "코드 제목",
            "content": "코드 내용",
            "created_time": "Fri Aug 04 16:34:32 KST 2023",
            "summarization": "코드 요약"
          }
        ]
      },
      {
        "title": "고급 Java",
        "teacher": "테스트 유저",
        "codes": [
          {
            "title": null,
            "content": "extra&extra",
            "created_time": null,
            "summarization": null
          },
          {
            "title": null,
            "content": "contentCC",
            "created_time": null,
            "summarization": null
          },
          {
            "title": null,
            "content": "contentCC",
            "created_time": null,
            "summarization": null
          },
          {
            "title": null,
            "content": "contentCC",
            "created_time": null,
            "summarization": null
          },
          {
            "title": null,
            "content": "@Bean\n    public RedisTemplate<?, ?> redisTemplate() {\n\n        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();\n        redisTemplate.setConnectionFactory(redisConnectionFactory());\n\n        redisTemplate.setKeySerializer(new StringRedisSerializer());   // Key: String\n        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(String.class));\n\n        // Hash Operation 사용 시\n        redisTemplate.setHashKeySerializer(new StringRedisSerializer());\n        redisTemplate.setHashValueSerializer(new Jackson2JsonRedisSerializer<>(Code.class));\n\n        // 혹은 아래 설정으로 모든 Key / Value Serialization을 변경할 수 있음\n        redisTemplate.setDefaultSerializer(new StringRedisSerializer());\n\n        return redisTemplate;\n    }",
            "created_time": null,
            "summarization": null
          }
        ]
      }
    ]
  },
  {
    "dateOfCourse": "2023-08-11",
    "courses": [
      {
        "title": "Python 수업",
        "teacher": "admin",
        "codes": [
          {
            "title": "코드 제목",
            "content": "코드 내용",
            "created_time": "Fri Aug 04 16:33:13 KST 2023",
            "summarization": "코드 요약"
          }
        ]
      }
    ]
  }
]

export default left_code_data;
