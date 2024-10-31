import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader, random_split
from torch.cuda.amp import autocast, GradScaler
import time

def time_batch_load(dataloader, device, num_batches=5):
    total_time = 0
    for i, (inputs, labels) in enumerate(dataloader):
        if i == 0:
            start = time.time()
            inputs = inputs.to(device)
            labels = labels.to(device)
            torch.cuda.synchronize()
            end = time.time()
            print(f"첫 번째 배치 로딩 시간: {end - start:.4f}초")
        elif i < num_batches:
            start = time.time()
            inputs = inputs.to(device)
            labels = labels.to(device)
            torch.cuda.synchronize()
            end = time.time()
            total_time += end - start
        else:
            break
    
    if num_batches > 1:
        avg_time = total_time / (num_batches - 1)
        print(f"2~{num_batches} 배치의 평균 로딩 시간: {avg_time:.4f}초")

def train_model(model, criterion, optimizer, train_loader, val_loader, num_epochs=50, save_every=5):
    scaler = GradScaler()  # Mixed Precision을 위한 GradScaler
    best_acc = 0.0

    for epoch in range(num_epochs):
        print(f'Epoch {epoch+1}/{num_epochs}')
        print('-' * 10)

        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
                dataloader = train_loader
            else:
                model.eval()
                dataloader = val_loader

            running_loss = 0.0
            running_corrects = 0

            for i, (inputs, labels) in enumerate(dataloader):
                if i % 500 == 0:
                    print(f"Processing batch {i}/{len(dataloader)} in {phase} phase")

                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    with autocast():  # Mixed Precision 적용
                        outputs = model(inputs)
                        _, preds = torch.max(outputs, 1)
                        loss = criterion(outputs, labels)

                    if phase == 'train':
                        scaler.scale(loss).backward()
                        scaler.step(optimizer)
                        scaler.update()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / len(dataloader.dataset)
            epoch_acc = running_corrects.double() / len(dataloader.dataset)

            print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                torch.save(model.state_dict(), 'C:/Users/SSAFY/Desktop/2학기 자율/Data/best_model.pth')

        # 매 5 에포크마다 모델 저장
        if (epoch + 1) % save_every == 0:
            torch.save(model.state_dict(), f'C:/Users/SSAFY/Desktop/2학기 자율/Data/model_epoch_{epoch+1}.pth')

    return model

if __name__ == '__main__':
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("Using device:", device)

    # CUDA 벤치마크 모드 활성화
    torch.backends.cudnn.benchmark = True

    data_dir = 'C:/Users/SSAFY/Desktop/2학기 자율/Data/processed_faces'

    data_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    full_dataset = datasets.ImageFolder(data_dir, transform=data_transforms)

    train_size = int(0.8 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True, num_workers=4, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False, num_workers=4, pin_memory=True)

    class_names = full_dataset.classes
    print("감정 클래스:", class_names)

    # 데이터 로딩 시간 측정
    print("\n훈련 데이터 로더 시간 측정:")
    time_batch_load(train_loader, device)

    print("\n검증 데이터 로더 시간 측정:")
    time_batch_load(val_loader, device)

    model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, len(class_names))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    model = train_model(model, criterion, optimizer, train_loader, val_loader, num_epochs=50, save_every=5)

    torch.save(model.state_dict(), 'C:/Users/SSAFY/Desktop/2학기 자율/Data/final_model.pth')
