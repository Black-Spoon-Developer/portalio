package com.example.portalio.config;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.jasypt.encryption.StringEncryptor;
import org.springframework.beans.factory.annotation.Value;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableEncryptableProperties
public class JasyptConfig {

    @Value("${jasypt.encryptor.key}")
    String key;

    @Bean(name = "jasyptStringEncryptor")
    public StringEncryptor stringEncryptor() {

        // PooledPBEStringEncryptor 인스턴스 생성: 성능 향상을 위해 풀(pool)을 사용하는 엄호화기법
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();

        // SimpleStringPBEConfig 인스턴스 생성: 암호화 구성을 위한 설정 객체
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();

        // 암호화 키 설정: 암호화와 복호화에 사용할 비밀 키 설정
        config.setPassword(key);

        // 암호화 알고리즘 설정: MD5 해싱과 DES 암호화를 결합한 PBE 알고리즘 사용
        config.setAlgorithm("PBEWithMD5AndDES");

        // 키 생성 반복 횟수 설정: 보안 강화를 위해 키 생성 과정에서 수행할 반복 횟수
        config.setKeyObtentionIterations("1000");

        // 풀 크기 설정: 동시에 수행될 수 있는 암호화 작업의 수를 1로 설정
        config.setPoolSize("1");

        // 암호화 제공자 설정: Java Cryptography Extension (JCE)의 SunJCE를 사용
        config.setProviderName("SunJCE");

        // 소금 생성기 클래스 설정: 암호화 시 사용할 소금을 무작위로 생성하는 클래스 지정
        config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");

        // 문자열 출력 형식 설정: 암호화된 데이터의 출력 형식을 base64로 설정
        config.setStringOutputType("base64");

        // 암호화기에 구성 설정 적용: 위에서 정의한 설정을 암호화기에 적용
        encryptor.setConfig(config);

        // 설정된 암호화기 반환: 외부에서 사용할 수 있도록 설정된 암호화기 객체 반환
        return encryptor;
    }
}