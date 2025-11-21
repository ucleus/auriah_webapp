import { Play } from "lucide-react";
import { PageLayout } from "../components/PageLayout";

// Mock data for media items
const MEDIA_ITEMS = [
  {
    id: 1,
    type: "image",
    src: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
    title: "Mountain Adventure",
  },
  {
    id: 2,
    type: "video",
    src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
    title: "Family Trip",
  },
  {
    id: 3,
    type: "image",
    src: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
    title: "Sunset View",
  },
  {
    id: 4,
    type: "image",
    src: "https://images.unsplash.com/photo-1682687220199-d0124f48f95b",
    title: "Forest Hike",
  },
];

export function Media() {
  return (
    <PageLayout
      title="Media"
      description="Your personal collection of photos and videos from Google Drive."
      fullWidth
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
          width: "100%",
        }}
      >
        {MEDIA_ITEMS.map((item) => (
          <div
            key={item.id}
            style={{
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              aspectRatio: "1",
              backgroundColor: "var(--card)",
              border: "1px solid #ffffff14",
            }}
          >
            {item.type === "video" ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#000",
                }}
              >
                <Play size={48} color="white" style={{ opacity: 0.8 }} />
                <video
                  src={item.src}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : (
              <img
                src={item.src}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "12px",
                background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                color: "white",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
