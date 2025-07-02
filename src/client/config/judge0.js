// Judge0 API Configuration
export const JUDGE0_CONFIG = {
    API_URL: 'https://judge0-ce.p.rapidapi.com',
    RAPIDAPI_KEY: '83cfe20895msh198ebd5653b02d6p1da0f3jsn529e735adef4',
    RAPIDAPI_HOST: 'judge0-ce.p.rapidapi.com',
    POLLING_INTERVAL: 1000, // 1 second
    MAX_POLLING_ATTEMPTS: 10,
};

// Supported programming languages with their Judge0 IDs
export const LANGUAGE_OPTIONS = [
    {
        id: 63,
        name: 'JavaScript (Node.js 12.14.0)',
        mode: 'javascript',
        template: 'console.log("Hello World!");',
        extension: '.js'
    },
    {
        id: 71,
        name: 'Python (3.8.1)',
        mode: 'python',
        template: 'print("Hello World!")',
        extension: '.py'
    },
    {
        id: 54,
        name: 'C++ (GCC 9.2.0)',
        mode: 'clike',
        template: `#include <iostream>

int main() {
    std::cout << "Hello World!" << std::endl;
    return 0;
}`,
        extension: '.cpp'
    },
    {
        id: 50,
        name: 'C (GCC 9.2.0)',
        mode: 'clike',
        template: `#include <stdio.h>

int main() {
    printf("Hello World!\\n");
    return 0;
}`,
        extension: '.c'
    },
    {
        id: 62,
        name: 'Java (OpenJDK 13.0.1)',
        mode: 'clike',
        template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
        extension: '.java'
    },
    {
        id: 51,
        name: 'C# (Mono 6.6.0.161)',
        mode: 'clike',
        template: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello World!");
    }
}`,
        extension: '.cs'
    },
    {
        id: 60,
        name: 'Go (1.13.5)',
        mode: 'go',
        template: `package main

import "fmt"

func main() {
    fmt.Println("Hello World!")
}`,
        extension: '.go'
    },
    {
        id: 72,
        name: 'Ruby (2.7.0)',
        mode: 'ruby',
        template: 'puts "Hello World!"',
        extension: '.rb'
    },
    {
        id: 73,
        name: 'Rust (1.40.0)',
        mode: 'rust',
        template: `fn main() {
    println!("Hello World!");
}`,
        extension: '.rs'
    },
    {
        id: 74,
        name: 'Swift (5.2.3)',
        mode: 'swift',
        template: `print("Hello World!")`,
        extension: '.swift'
    }
];

// Judge0 status codes
export const JUDGE0_STATUS = {
    IN_QUEUE: 1,
    PROCESSING: 2,
    ACCEPTED: 3,
    WRONG_ANSWER: 4,
    TIME_LIMIT_EXCEEDED: 5,
    COMPILATION_ERROR: 6,
    RUNTIME_ERROR: 7,
    MEMORY_LIMIT_EXCEEDED: 8,
    OUTPUT_LIMIT_EXCEEDED: 9,
    PRESENTATION_ERROR: 10,
    INTERNAL_ERROR: 11,
};

// Helper function to get language by ID
export const getLanguageById = (id) => {
    return LANGUAGE_OPTIONS.find(lang => lang.id === id);
};

// Helper function to get language by name
export const getLanguageByName = (name) => {
    return LANGUAGE_OPTIONS.find(lang => lang.name === name);
}; 