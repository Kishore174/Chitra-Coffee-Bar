export const auditdata ={
  "shop": "60c72b2f5f1b2c001f76a1a1", 
  "auditDate": "2024-11-07T00:00:00Z",
  "auditor": "60c72b2f5f1b2c001f76a1a2", 
  "status": "pending",
  "teaAudit": {
    "quality": "good",
    "color": "perfect",
    "sugarLevel": "perfect",
    "temperature": "hot",
    "aroma": "excellent",
    "taste": "excellent",
    "remark": "Tea quality is great, no complaints.",
    "rating": 5,
    "captureImages": [
      {
        "imageUrl": "https://example.com/tea_image1.jpg",
        "location": "Tea counter",
        "date": "2024-11-07T12:00:00Z"
      },
      {
        "imageUrl": "https://example.com/tea_image2.jpg",
        "location": "Tea counter",
        "date": "2024-11-07T12:10:00Z"
      }
    ]
  },
  "coffieAudit": {
    "quality": "good",
    "color": "perfect",
    "sugarLevel": "low",
    "temperature": "warm",
    "aroma": "excellent",
    "taste": "excellent",
    "remark": "Coffee served was perfect.",
    "rating": 5,
    "captureImages": [
      {
        "imageUrl": "https://example.com/coffee_image1.jpg",
        "location": "Coffee counter",
        "date": "2024-11-07T12:30:00Z"
      }
    ]
  },
  "liveSnacks": {
    "snacks": [
      {
        "snack": "60c72b2f5f1b2c001f76a1b3",
        "status": "available"
      },
      {
        "snack": "60c72b2f5f1b2c001f76a1b4",
        "status": "not available"
      }
    ],
    "remark": "Some snacks were out of stock.",
    "rating": 4,
    "captureImages": [
      {
        "imageUrl": "https://example.com/snack_image1.jpg",
        "location": "Snack counter",
        "date": "2024-11-07T13:00:00Z"
      }
    ]
  },
  "bakeryProducts": [
    {
      "product": "60c72b2f5f1b2c001f76a1b5",
      "quantity": 10,
      "expirationDate": "2024-11-15T00:00:00Z",
      "captureImages": [
        {
          "imageUrl": "https://example.com/bakery_image1.jpg",
          "location": "Bakery counter",
          "date": "2024-11-07T13:30:00Z"
        }
      ]
    }
  ],
  "insideShop": {
    "dining": {
      "hygiene": "good",
      "rating": 5,
      "captureImages": [
        {
          "imageUrl": "https://example.com/dining_area.jpg",
          "location": "Dining area",
          "date": "2024-11-07T14:00:00Z"
        }
      ],
      "remark": "Dining area is clean."
    },
    "handWash": {
      "hygiene": "good",
      "rating": 5,
      "captureImages": [
        {
          "imageUrl": "https://example.com/handwash_area.jpg",
          "location": "Hand wash area",
          "date": "2024-11-07T14:15:00Z"
        }
      ],
      "remark": "Hand wash area is well maintained."
    }
  },
  "insideKitchen": {
    "snackMaking": {
      "hygiene": "good",
      "rating": 4,
      "captureImages": [
        {
          "imageUrl": "https://example.com/snack_making_area.jpg",
          "location": "Kitchen - Snack making",
          "date": "2024-11-07T14:30:00Z"
        }
      ],
      "remark": "Clean but could use some more organization."
    }
  },
  "outsideKitchen": {
    "shopBoard": {
      "available": "available",
      "hygiene": "good",
      "rating": 5,
      "captureImages": [
        {
          "imageUrl": "https://example.com/shop_board.jpg",
          "location": "Outside kitchen - Shop board",
          "date": "2024-11-07T14:45:00Z"
        }
      ],
      "remark": "Shop board is well-maintained."
    }
  },
  "wallBranding": {
    "menuBrand": {
      "available": "available",
      "rating": 5,
      "captureImages": [
        {
          "imageUrl": "https://example.com/menu_branding.jpg",
          "location": "Shop - Menu",
          "date": "2024-11-07T15:00:00Z"
        }
      ],
      "remark": "Menu branding is clear and visible."
    }
  },
  "employees": [
    {
      "count": 5,
      "names": ["Alice", "Bob", "Charlie", "David", "Eve"],
      "area": "kitchen"
    }
  ],
  "painting": {
    "fan": {
      "condition": "good"
    },
    "light": {
      "condition": "good"
    },
    "ceiling": {
      "condition": "good"
    },
    "wallPainting": {
      "condition": "good"
    },
    "floorTile": {
      "condition": "good"
    },
    "remark": "The shop's painting and decor are in great condition.",
    "rating": 5,
    "captureImages": [
      {
        "imageUrl": "https://example.com/interior_painting.jpg",
        "location": "Interior - Ceiling",
        "date": "2024-11-07T15:30:00Z"
      }
    ]
  },
  "stack": {
    "captureImages": [
      {
        "imageUrl": "https://example.com/stack_image.jpg",
        "location": "Stack area",
        "date": "2024-11-07T16:00:00Z"
      }
    ],
    "remark": "Stack area is well-organized."
  },
  "uniformSection": [
    {
      "totalEmployees": 5,
      "wear": 4,
      "notWear": 1,
      "type": "cap",
      "remark": "One employee not wearing a cap.",
      "rating": 4
    }
  ],
  "total_items_checked": 35,
  "comments": "Overall, the shop is well-maintained and staff are performing well.",
  "rating": 4
}