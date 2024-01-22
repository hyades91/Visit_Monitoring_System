# Használj egy megfelelő .NET SDK alapimage-t -> SDK-ra figyelni!!!
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app

# Másold át a .csproj fájlt és restore-öld a függőségeket Itt azt a mappát kell megadni a * előtt, amiben a csproj fájl van
COPY /VisitMonitoringSystem *.csproj ./
RUN dotnet restore

# Másold át az összes forráskódot
COPY . ./
RUN dotnet publish -c Release -o out

# Használj egy kisebb alapimage-t a futtatáshoz -> SDK-ra figyelni!!!
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out .

#port beállítás
ENV ASPNETCORE_URLS=http://+:80

# Az alkalmazás indulási parancsa
ENTRYPOINT ["dotnet", "VisitMonitoringSystem.dll"]
