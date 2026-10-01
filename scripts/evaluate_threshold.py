import os
import sys
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Adding parent dir to sys.path to allow importing from the root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

embedder = SentenceTransformer("all-MiniLM-L6-v2")

def evaluate_thresholds():
    # 20+ pairs of terms, labeled 1 for synonym/highly related, 0 for distinct
    labeled_pairs = [
        ("Gradient Descent", "Steepest Descent", 1),
        ("Neural Network", "Artificial Neural Network", 1),
        ("Cost Function", "Loss Function", 1),
        ("Learning Rate", "Step Size", 1),
        ("Backpropagation", "Backward Propagation", 1),
        ("Weights", "Parameters", 1),
        ("Epoch", "Iteration", 0), # Different concepts in ML
        ("Overfitting", "High Variance", 1),
        ("Underfitting", "High Bias", 1),
        ("Regularization", "Weight Decay", 1),
        ("Activation Function", "Transfer Function", 1),
        
        ("Gradient Descent", "Backpropagation", 0),
        ("Learning Rate", "Weights", 0),
        ("Cost Function", "Epoch", 0),
        ("Neural Network", "Linear Regression", 0),
        ("Overfitting", "Underfitting", 0),
        ("Regularization", "Activation Function", 0),
        ("Weights", "Loss Function", 0),
        ("Epoch", "Batch Size", 0),
        ("Variance", "Bias", 0),
        ("Precision", "Recall", 0),
        ("F1 Score", "Accuracy", 0)
    ]
    
    term1_list = [p[0] for p in labeled_pairs]
    term2_list = [p[1] for p in labeled_pairs]
    labels = [p[2] for p in labeled_pairs]
    
    emb1 = embedder.encode(term1_list)
    emb2 = embedder.encode(term2_list)
    
    similarities = [cosine_similarity([e1], [e2])[0][0] for e1, e2 in zip(emb1, emb2)]
    
    thresholds = [0.70, 0.75, 0.80]
    
    print("Similarity Threshold Evaluation")
    print("-" * 50)
    for pair, sim, label in zip(labeled_pairs, similarities, labels):
        print(f"{pair[0]:<25} | {pair[1]:<25} | Label: {label} | Sim: {sim:.3f}")
    
    print("\nResults:")
    print("-" * 50)
    for t in thresholds:
        tp = 0
        fp = 0
        tn = 0
        fn = 0
        
        for sim, label in zip(similarities, labels):
            pred = 1 if sim >= t else 0
            if pred == 1 and label == 1:
                tp += 1
            elif pred == 1 and label == 0:
                fp += 1
            elif pred == 0 and label == 0:
                tn += 1
            elif pred == 0 and label == 1:
                fn += 1
                
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
        
        print(f"Threshold: {t:.2f} | Precision: {precision:.2f} | Recall: {recall:.2f} | F1: {f1:.2f}")

if __name__ == "__main__":
    evaluate_thresholds()
