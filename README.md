# 🕺 Dancify

### 춤을 배우고 싶은 모두를 위한 AI 안무 연습 서비스 (🏆 AIVLE SCHOOL 빅 프로젝트 우수상 수상)
![포스터_최종](https://github.com/Yujun-Won/Dancify/assets/124374862/7a366011-b023-4388-97bd-31aa643a7602)

## 목차
1. [프로젝트 소개](#1-프로젝트-소개)
2. [서비스 주요 기능](#2-서비스-주요-기능)
3. [프로젝트 아키텍처](#3-프로젝트-아키텍처)
4. [데이터셋](#4-데이터셋)
5. [기술 스택](#5-기술-스택)
6. [프로젝트 팀원 소개](#6-프로젝트-팀원-소개)
7. [실행 방법](#7-실행-방법)

<br>

## **1. 프로젝트 소개**

### **1.1 주제 선정 배경 및 프로젝트 개요**

블랙핑크, BTS와 같은 월드 스타들의 등장에 따라 세계적으로 K-POP에 대한 인기와 관심이 더욱 높아지고 있습니다.

이로 인해 시장 규모는 꾸준히 확대되고 있으며, 방송 댄스 강좌에 대한 수요가 더욱 증가하고 있습니다.

그러나 춤을 배우는 것에는 여전히 수강료에 대한 부담과 정해진 시간 및 공간에서 레슨을 받아야 한다는 제약이 있습니다.

저희는 경제적 부담과 시공간적 제약을 극복하고 더 많은 사람들이 춤을 배우고 즐길 수 있는 기회를 제공하고자 합니다.

이를 통해, K-POP 댄스에 대한 열정을 가진 사람들이 보다 쉽고 효율적으로 교육을 받을 수 있을 것으로 기대하고 있습니다.

<br>

### **1.2 서비스 목표**

춤을 배우고 싶은 사람들을 위해 AI와 전문가 피드백을 중심으로 저비용의 교육적인 서비스를 제공합니다.

<br>

## **2. 서비스 주요 기능**

### **2.1 메인 페이지 (댄서 게시판)**

- 따라 추고 싶은 댄서의 영상으로 접속하여 직접 춤을 추고 피드백 받을 수 있습니다.
- 연습모드와 실전모드가 있어 점진적 학습이 가능합니다.
  - 연습모드: 구간별 연습이 가능합니다.
  - 실전모드: 전구간을 한 번에 진행합니다.
- AI를 통해 실시간 점수와 구간별 점수를 제공받을 수 있습니다.
- 음성 조작을 통해 보다 편리한 사용자 경험을 제공합니다.

<img width="2044" alt="댄서게시판1" src="https://github.com/Yujun-Won/Dancify/assets/124374862/cfac36da-a004-4428-bddd-2a16956c1e13">
<img width="2044" alt="댄서게시판2" src="https://github.com/Yujun-Won/Dancify/assets/124374862/d043b3af-a59e-4c04-84d5-9954cb976736">
<img width="2044" alt="댄서게시판3" src="https://github.com/Yujun-Won/Dancify/assets/124374862/482a1b50-4951-43b9-8f1b-126f2670cbe4">
<img width="2044" alt="댄서게시판4" src="https://github.com/Yujun-Won/Dancify/assets/124374862/6842b413-909f-4cbe-9547-6c0dc4f5c51f">


### **2.2 자랑 게시판**

- 자랑 게시판을 통해 자신이 춘 춤 영상을 공유할 수 있습니다.

<img width="2044" alt="자랑게시판1" src="https://github.com/Yujun-Won/Dancify/assets/124374862/ad0ba0a0-5e2c-4083-8476-8ea3b7886f56">
<img width="2044" alt="자랑게시판2" src="https://github.com/Yujun-Won/Dancify/assets/124374862/ec5bc7c4-cf8a-44a9-8906-f2347b992fcf">


### **2.3 자유 게시판**

- 자유 게시판을 통해 사람들과 소통할 수 있습니다.

<img width="2044" alt="자유게시판1" src="https://github.com/Yujun-Won/Dancify/assets/124374862/7e844859-eea9-44bb-bb08-17745b4db311">
<img width="2044" alt="자유게시판2" src="https://github.com/Yujun-Won/Dancify/assets/124374862/e5a222c4-044f-4d1b-8025-d9b6461e8cb5">


### **2.4 피드백 동영상**

- 자신이 춘 춤 영상을 관리하고 댄서에게 피드백을 요청할 수 있습니다.
- 신체 부위별 AI 피드백을 받을 수 있습니다.

<img width="2044" alt="피드백게시판" src="https://github.com/Yujun-Won/Dancify/assets/124374862/c0e8e8b9-ef47-4755-b0cd-befa70f23f86">

<br>

## **3. 프로젝트 아키텍처**

### Infrastructure
![인프라](https://github.com/Yujun-Won/Dancify/assets/124374862/b004ae46-de26-4709-a76a-1e3f0322d967)

### ERD
![ERD](https://github.com/Yujun-Won/Dancify/assets/124374862/2ea39503-ddfe-49c1-b83d-c6368a8142fc)

<br>

## **4. 데이터셋**

<img width="869" alt="데이터셋" src="https://github.com/Yujun-Won/Dancify/assets/124374862/39ceb91e-dc10-4772-a058-d2df264858b7">

[데이터셋 페이지로 이동 🚀](https://aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&aihubDataSe=realm&dataSetSn=52)


<br>

## **5. 기술 스택**

| 영역 | 기술 |
| :-: | :-: |
| **프론트엔드** | ![Typescript](https://img.shields.io/badge/-Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=Next.js&logoColor=white) |
| **백엔드**  | ![Django](https://img.shields.io/badge/-Django-092E20?style=flat-square&logo=Django&logoColor=white) ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white) ![AWS S3](https://img.shields.io/badge/-AWS%20S3-232F3E?style=flat-square&logo=Amazon%20AWS&logoColor=white) |
| **인공지능**  | ![TensorFlow.js](https://img.shields.io/badge/-TensorFlow.js-FF6F00?style=flat-square&logo=TensorFlow&logoColor=white) ![Mediapipe](https://img.shields.io/badge/-Mediapipe-00A6D6?style=flat-square&logo=Google&logoColor=white) ![OpenCV](https://img.shields.io/badge/-OpenCV-5C3EE8?style=flat-square&logo=OpenCV&logoColor=white) |
| **인프라** | ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=Docker&logoColor=white) ![AWS EC2](https://img.shields.io/badge/-AWS%20EC2-232F3E?style=flat-square&logo=Amazon%20AWS&logoColor=white) ![Nginx](https://img.shields.io/badge/-Nginx-009639?style=flat-square&logo=Nginx&logoColor=white) ![AWS Lambda](https://img.shields.io/badge/-AWS%20Lambda-FF9900?style=flat-square&logo=Amazon%20AWS&logoColor=white) |
| **UI/UX** | ![Figma](https://img.shields.io/badge/-Figma-F24E1E?style=flat-square&logo=Figma&logoColor=white) |
| **협업** | ![Github](https://img.shields.io/badge/-Github-181717?style=flat-square&logo=GitHub&logoColor=white) ![Discord](https://img.shields.io/badge/-Discord-7289DA?style=flat-square&logo=Discord&logoColor=white) ![Microsoft Teams](https://img.shields.io/badge/-Microsoft%20Teams-6264A7?style=flat-square&logo=Microsoft%20Teams&logoColor=white) |

<br>

## **6. 프로젝트 팀원 소개**

<table>
  <tr>
    <td align="center"><a href="https://github.com/kimyoo04"><img src="https://avatars.githubusercontent.com/u/58503130?v=4" width="100px;"></td>
    <td align="center"><a href="https://github.com/bfmeef"><img src="https://avatars.githubusercontent.com/u/24477729?&v=4" width="100px;"></td>
    <td align="center"><a href="https://github.com/wath1457"><img src="https://avatars.githubusercontent.com/u/93395614?v=4" width="100px;"></td>
    <td align="center"><a href="https://github.com/dptcldpa"><img src="https://avatars.githubusercontent.com/u/116916268?v=4" width="100px;"></td>
    <td align="center"><a href="https://github.com/heewon00"><img src="https://avatars.githubusercontent.com/u/55778040?v=4" width="100px;"></td>
    <td align="center"><a href="https://github.com/Yujun-Won"><img src="https://avatars.githubusercontent.com/u/124374862?v=4" width="100px;"></td>
    <td align="center"><a href="https://github.com/Leechansol"><img src="https://avatars.githubusercontent.com/u/18729932?v=4" width="100px;"></td>
  </tr>
  <tr>
    <td align="center"><b><a href="https://github.com/kimyoo04">김유 (팀장)</a></b></td>
    <td align="center"><b><a href="https://github.com/bfmeef">박수민</a></b></td>
    <td align="center"><b><a href="https://github.com/wath1457">장혁</a></b></td>
    <td align="center"><b><a href="https://github.com/dptcldpa">조해민</a></b></td>
    <td align="center"><b><a href="https://github.com/heewon00">박희원</a></b></td>
    <td align="center"><b><a href="https://github.com/Yujun-Won">원유준</a></b></td>
    <td align="center"><b><a href="https://github.com/Leechansol">이찬솔</a></b></td>
  </tr>
  <tr>
    <td align="center"><b>FE</b></td>
    <td align="center"><b>BE</b></td>
    <td align="center"><b>BE</b></td>
    <td align="center"><b>BE</b></td>
    <td align="center"><b>AI</b></td>
    <td align="center"><b>AI</b></td>
    <td align="center"><b>AI</b></td>
  </tr>
</table>

<br>

## **7. 실행 방법**

### 1. 환경변수 설정
- 프로젝트를 실행하기 전에 `.env` 파일을 설정해야 합니다.
- `.env` 파일을 프로젝트 루트 디렉토리에 생성하고 아래와 같이 키(key)를 작성하세요.
```
# nextjs
NEXT_PUBLIC_ENV_API_DOMAIN
NEXT_PUBLIC_ENV_API_URL
NEXT_PUBLIC_ENV_DOMAIN
NEXT_PUBLIC_ENV_JWT_SECRET_KEY

# django
DJANGO_SECRET_KEY
DJANGO_TIME_ZONE
DJANGO_LANGUAGE_CODE
DJANGO_NEXTJS_URL

# S3
DJANGO_S3_ACCESS_KEY_ID
DJANGO_S3_SECRET_ACCESS_KEY
AWS_DOMAIN
ORIGIN_VIDEO_DOMAIN
CLOUDFRONT_DOMAIN

# MYSQL
MYSQL_DATABASE
MYSQL_ROOT_PASSWORD
MYSQL_HOST
MYSQL_USER
MYSQL_PASSWORD
```

### 2. Docker를 통한 실행

```docker
docker-compose -f docker-compose-front.yml
docker-compose -f docker-compose-back.yml
```
