const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Custom storage using memory storage and Cloudinary upload
const storage = multer.memoryStorage();

// File filter function
const createFileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    const fileType = file.mimetype.split('/')[0];
    const fileExt = file.originalname.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(fileType) || allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
  };
};

// Multer upload configurations
const uploadConfigs = {
  images: multer({ 
    storage: storage,
    fileFilter: createFileFilter(['image', 'jpg', 'jpeg', 'png', 'gif', 'webp']),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
  }),
  
  datasets: multer({ 
    storage: storage,
    fileFilter: createFileFilter(['csv', 'json', 'txt', 'xlsx', 'zip', 'application']),
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
  }),
  
  models: multer({ 
    storage: storage,
    fileFilter: createFileFilter(['h5', 'pb', 'onnx', 'pkl', 'json', 'application']),
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB
  }),
  
  files: multer({ 
    storage: storage,
    fileFilter: createFileFilter(['pdf', 'doc', 'docx', 'txt', 'application']),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
  }),
  
  media: multer({ 
    storage: storage,
    fileFilter: createFileFilter(['audio', 'video', 'mp4', 'mp3', 'wav', 'avi', 'mov']),
    limits: { fileSize: 200 * 1024 * 1024 } // 200MB
  })
};

// Utility functions
const cloudinaryUtils = {
  // Upload a file buffer to Cloudinary
  uploadBuffer: async (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'freemind-ai/temp',
          resource_type: options.resource_type || 'auto',
          ...options
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });
  },

  // Delete a file from Cloudinary
  deleteFile: async (publicId, resourceType = 'image') => {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });
      return result;
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      throw error;
    }
  },

  // Get optimized URL for an image
  getOptimizedUrl: (publicId, options = {}) => {
    return cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto',
      ...options
    });
  },

  // Generate thumbnail for video files
  generateVideoThumbnail: (publicId, options = {}) => {
    return cloudinary.url(publicId, {
      resource_type: 'video',
      format: 'jpg',
      quality: 'auto',
      ...options
    });
  },

  // Get file info
  getFileInfo: async (publicId, resourceType = 'image') => {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: resourceType
      });
      return result;
    } catch (error) {
      console.error('Error getting file info from Cloudinary:', error);
      throw error;
    }
  }
};

module.exports = {
  cloudinary,
  uploadConfigs,
  cloudinaryUtils
};
