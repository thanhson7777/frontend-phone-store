import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  Skeleton,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getArticleDetailPublicAPI } from "~/apis";

const CATEGORY_LABELS = {
  news: { label: "Tin tức", color: "info" },
  review: { label: "Review", color: "warning" },
  guide: { label: "Hướng dẫn", color: "success" },
  tips: { label: "Tips", color: "secondary" },
};

const formatDate = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function looksLikeHtml(str) {
  return typeof str === "string" && /<[a-z][\s\S]*>/i.test(str);
}

function ArticleDetailPage() {
  const { slugOrId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slugOrId) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setNotFound(false);
        const data = await getArticleDetailPublicAPI(slugOrId);
        if (!cancelled) {
          setArticle(data || null);
          setNotFound(!data);
        }
      } catch {
        if (!cancelled) {
          setArticle(null);
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slugOrId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton height={32} width="40%" />
        <Skeleton height={48} sx={{ mt: 2 }} />
        <Skeleton
          variant="rectangular"
          height={280}
          sx={{ mt: 2, borderRadius: 2 }}
        />
        <Skeleton height={24} sx={{ mt: 2 }} />
        <Skeleton height={24} />
        <Skeleton height={24} width="80%" />
      </Container>
    );
  }

  if (notFound || !article) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Không tìm thấy bài viết
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Liên kết có thể đã thay đổi hoặc bài đã gỡ.
        </Typography>
        <Button
          component={RouterLink}
          to="/articles"
          startIcon={<ArrowBackIcon />}
          variant="contained"
          color="error"
        >
          Về danh sách bài viết
        </Button>
      </Container>
    );
  }

  const cat = CATEGORY_LABELS[article.category] || CATEGORY_LABELS.news;
  const content = article.content || "";
  const html = looksLikeHtml(content);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Trang chủ
        </Link>
        <Link
          component={RouterLink}
          to="/articles"
          underline="hover"
          color="inherit"
        >
          Bài viết
        </Link>
        <Typography color="text.primary" noWrap sx={{ maxWidth: 240 }}>
          {article.title}
        </Typography>
      </Breadcrumbs>

      <Button
        component={RouterLink}
        to="/articles"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        color="inherit"
      >
        Quay lại
      </Button>

      <Chip label={cat.label} color={cat.color} size="small" sx={{ mb: 2 }} />

      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        {article.title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {formatDate(article.publishedAt || article.createdAt)}
        {article.author?.name ? ` · ${article.author.name}` : ""}
        {typeof article.viewCount === "number"
          ? ` · ${article.viewCount} lượt xem`
          : ""}
      </Typography>

      {article.thumbnail && (
        <Box
          component="img"
          src={article.thumbnail}
          alt={article.title}
          sx={{
            width: "100%",
            maxHeight: 420,
            objectFit: "cover",
            borderRadius: 2,
            mb: 3,
          }}
        />
      )}

      {article.excerpt && (
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            mb: 3,
            fontStyle: "italic",
            borderLeft: 4,
            borderColor: "error.main",
            pl: 2,
          }}
        >
          {article.excerpt}
        </Typography>
      )}

      {html ? (
        <Box
          className="article-body"
          sx={{
            "& img": { maxWidth: "100%", height: "auto", borderRadius: 1 },
            "& p": { mb: 2 },
            "& h2, & h3": { mt: 3, mb: 1 },
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <Typography
          component="div"
          variant="body1"
          sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
        >
          {content}
        </Typography>
      )}
    </Container>
  );
}

export default ArticleDetailPage;
