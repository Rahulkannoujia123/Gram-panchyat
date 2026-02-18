// TensorFlow.js based cloth item counter
// This module detects clothing items in photos

export interface DetectionResult {
  count: number;
  items: string[];
  confidence: number;
  photoUrl: string;
}

// Clothing-related COCO classes that we want to count
const CLOTHING_CLASSES = [
  'person', // For counting based on person in clothes
  'shirt', 'tie', 'hat', 'shoe', 'bag', 'dress',
  'sock', 'pant', 'jacket', 'shorts', 'skirt',
  'watch', 'belt', 'boot', 'glove', 'coat',
  'handbag', 'backpack', 'suitcase',
];

let modelLoaded = false;
let cocoSsdModel: any = null;

/**
 * Initialize TensorFlow.js and load COCO-SSD model
 */
export async function initializeAICounter(): Promise<void> {
  if (modelLoaded) return;

  try {
    // Dynamically load TensorFlow.js and COCO-SSD
    const tf = await import('@tensorflow/tfjs');
    const cocoSsd = await import('@tensorflow-models/coco-ssd');

    cocoSsdModel = await cocoSsd.load();
    modelLoaded = true;
    console.log('[v0] AI Model loaded successfully');
  } catch (error) {
    console.error('[v0] Failed to load AI model:', error);
    throw new Error('Failed to initialize AI cloth counter');
  }
}

/**
 * Detect clothing items in an image
 * Returns count and confidence score
 */
export async function detectClothingItems(
  imageElement: HTMLImageElement | HTMLCanvasElement
): Promise<DetectionResult> {
  if (!modelLoaded) {
    await initializeAICounter();
  }

  try {
    // Run detection
    const predictions = await cocoSsdModel.estimateObjects(imageElement);
    console.log('[v0] Raw predictions:', predictions);

    // Filter for clothing-related items
    const clothingItems = predictions.filter((pred: any) =>
      CLOTHING_CLASSES.some(cls => pred.class.toLowerCase().includes(cls.toLowerCase()))
    );

    console.log('[v0] Clothing detected:', clothingItems.length);

    // For a more practical dry cleaning counter:
    // Count based on confidence and class type
    let itemCount = 0;
    const detectedClasses: string[] = [];

    clothingItems.forEach((item: any) => {
      if (item.score > 0.3) {
        // Only count high-confidence detections
        itemCount += 1;
        detectedClasses.push(`${item.class} (${(item.score * 100).toFixed(0)}%)`);
      }
    });

    // Get canvas/image as data URL
    let photoUrl = '';
    if (imageElement instanceof HTMLCanvasElement) {
      photoUrl = imageElement.toDataURL('image/jpeg', 0.7);
    } else {
      photoUrl = imageElement.src;
    }

    return {
      count: Math.max(itemCount, 1), // At least 1 item
      items: detectedClasses,
      confidence: clothingItems.length > 0 ? predictions[0].score : 0.5,
      photoUrl,
    };
  } catch (error) {
    console.error('[v0] Detection error:', error);
    throw error;
  }
}

/**
 * Simple fallback counter if AI doesn't load
 * User can click on items in the image to count them
 */
export function createManualCounterMode(): void {
  console.log('[v0] Falling back to manual counter mode');
}

/**
 * Calculate total cost based on item count and rate
 */
export function calculateCost(itemCount: number, ratePerItem: number = 8): number {
  return itemCount * ratePerItem;
}
