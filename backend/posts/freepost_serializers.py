from rest_framework import serializers

from .models import FreePost
from comments.models import Comment
from like.models import Like


class GetListSerializer(serializers.ModelSerializer):
    """
    GET 요청이 들어와 List 액션을 실행할 때
    다음 Json을 반환하는 Serializer

    _____
    - postId: 아이디
    - title: 게시글 제목
    - nickname: 작성자 닉네임
    - content: 게시글 내용
    - createDate: 작성 일자
    - postImage: 사진 URL
    - views: 게시글 조회수
    - commentsCount: 댓글 개수
    - likesCount: 좋아요 개수
    """
    postId = serializers.UUIDField(source='post_id')
    nickname = serializers.CharField(source='user.nickname')
    createDate = serializers.DateField(source='create_date')
    postImage = serializers.URLField(source='post_image')
    commentsCount = serializers.SerializerMethodField()
    likesCount = serializers.SerializerMethodField()

    def get_commentsCount(self, instance):
        return Comment.objects.filter(post_id=instance.post_id).count()

    def get_likesCount(self, instance):
        return Like.objects.filter(post_id=instance.post_id).count()

    class Meta:
        model = FreePost
        fields = ['postId', 'title', 'nickname', 'content',
                  'createDate', 'postImage', 'views',
                  'commentsCount', 'likesCount']


class GetRetrieveSerializer(serializers.ModelSerializer):
    """
    GET 요청이 들어와 Retrieve 액션을 실행할 때
    다음 Json을 반환하는 Serializer

    _____
    - postId: 아이디
    - title: 게시글 제목
    - userId: 작성자 아이디
    - nickname: 작성자 닉네임
    - content: 게시글 내용
    - createDate: 작성 일자
    - postImage: 사진 URL
    - views: 게시글 조회수
    - likesCount: 좋아요 개수
    - comments: 댓글 정보 리스트
    """
    postId = serializers.UUIDField(source='post_id')
    userId = serializers.CharField(source='user.user_id')
    nickname = serializers.CharField(source='user.nickname')
    createDate = serializers.DateField(source='create_date')
    postImage = serializers.URLField(source='post_image')
    likesCount = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()

    def get_likesCount(self, instance):
        return Like.objects.filter(post_id=instance.post_id).count()

    def get_comments(self, instance):
        comments = Comment.objects.filter(post_id=instance.post_id)
        # 직렬화하기 위해 리스트로 변환
        serialized_comments = []
        for comment in comments:
            serialized_comment = {
                'commentId': comment.comment_id,
                'userId': comment.user.user_id,
                'nickname': comment.user.nickname,
                'content': comment.content,
                'createDate': comment.create_date
            }
            serialized_comments.append(serialized_comment)
        return serialized_comments

    class Meta:
        model = FreePost
        fields = ['postId', 'title', 'userId', 'nickname',
                  'content', 'createDate', 'postImage',
                  'views', 'likesCount', 'comments']


class PostPatchSerializer(serializers.HyperlinkedModelSerializer):
    """
    POST, PATCH 요청이 들어오면 다음 Json을 받아 요청을 처리하는 Serializer

    ___
    - title: 게시글 제목
    - content: 게시글 내용
    - postImage: 사진 URL
    """
    postImage = serializers.URLField(source='post_image',
                                     required=False, allow_blank=True)

    class Meta:
        model = FreePost
        fields = ['title', 'content', 'postImage']
