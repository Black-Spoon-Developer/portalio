//package com.example.portalio.domain.oauthtoken.entity;
//
//import static com.example.portalio.domain.oauthtoken.enums.Provide.Kakao;
//
//import com.example.portalio.domain.oauthtoken.enums.Provide;
//import com.example.portalio.domain.userdetail.entity.UserDetail;
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.EnumType;
//import jakarta.persistence.Enumerated;
//import jakarta.persistence.FetchType;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.OneToOne;
//import jakarta.persistence.Table;
//import lombok.AccessLevel;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//
//@Entity
//@Getter
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@Table(name = "oauth_token")
//public class OauthToken {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "oauth_id")
//    private long oauthId;
//
//    @Column(name = "oauth_refresh_value", nullable = false, columnDefinition = "TEXT")
//    private String oauthRefreshValue;
//
//    @Column(name = "oauth_access_value", nullable = false, columnDefinition = "TEXT")
//    private String oauthAccessValue;
//
//    @Enumerated(value = EnumType.STRING)
//    @Column(name = "oauth_provide", nullable = false)
//    private Provide oauthProvider = Kakao;
//
//    @OneToOne(mappedBy = "oauthToken", fetch = FetchType.LAZY)
//    private UserDetail userDetail;
//}
