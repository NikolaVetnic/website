import "./Gallery.css";

import galleryImage1 from "../../Images/gallery1.webp";
import galleryImage2 from "../../Images/gallery2.webp";
import galleryImage3 from "../../Images/gallery3.webp";
import galleryImage4 from "../../Images/gallery4.webp";
import galleryImage5 from "../../Images/gallery5.webp";
import galleryImage6 from "../../Images/gallery6.webp";
import galleryImage7 from "../../Images/gallery7.webp";

const images = [
  { src: galleryImage1, alt: "Gallery 1" },
  { src: galleryImage2, alt: "Gallery 2" },
  { src: galleryImage3, alt: "Gallery 3" },
  { src: galleryImage4, alt: "Gallery 4" },
  { src: galleryImage5, alt: "Gallery 5" },
  { src: galleryImage6, alt: "Gallery 6" },
  { src: galleryImage7, alt: "Gallery 7" },
];

const Gallery = () => {
  return (
    <div>
      <h2>The Gallery</h2>
      <div className="gallery-images">
        {images.map((image, index) => (
          <a key={index} href={image.src} target="_blank" rel="noopener noreferrer">
            <img src={image.src} alt={image.alt} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
